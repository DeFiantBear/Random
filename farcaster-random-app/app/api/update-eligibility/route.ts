import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { farcaster_id, action } = await request.json()

    if (!farcaster_id || !action) {
      return NextResponse.json(
        { error: 'Farcaster ID and action are required' },
        { status: 400 }
      )
    }

    if (!['spin', 'share'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "spin" or "share"' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    // Check if user already exists in eligibility table
    const { data: existingEligibility, error: checkError } = await supabase
      .from('user_eligibility')
      .select('*')
      .eq('farcaster_id', farcaster_id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Database error', details: checkError.message },
        { status: 500 }
      )
    }

    let updateData: any = {}
    let isEligible = false

    if (existingEligibility) {
      // Update existing record
      updateData = {
        ...existingEligibility,
        [action === 'spin' ? 'has_spun' : 'has_shared']: true,
        updated_at: new Date().toISOString()
      }
      
      // Check if user is now eligible (has both spun and shared)
      isEligible = updateData.has_spun && updateData.has_shared
      updateData.is_eligible = isEligible

      const { data, error } = await supabase
        .from('user_eligibility')
        .update(updateData)
        .eq('farcaster_id', farcaster_id)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Failed to update eligibility', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        farcaster_id,
        has_spun: data.has_spun,
        has_shared: data.has_shared,
        is_eligible: data.is_eligible,
        newly_eligible: isEligible && !existingEligibility.is_eligible
      })

    } else {
      // Create new record
      updateData = {
        farcaster_id,
        has_spun: action === 'spin',
        has_shared: action === 'share',
        is_eligible: false, // Can't be eligible with just one action
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('user_eligibility')
        .insert(updateData)
        .select()
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Failed to create eligibility record', details: error.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        farcaster_id,
        has_spun: data.has_spun,
        has_shared: data.has_shared,
        is_eligible: data.is_eligible,
        newly_eligible: false
      })
    }

  } catch (error) {
    console.error('Error updating eligibility:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 