import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTripDurationDays,
  scoreAttraction,
  generateItineraryDays,
  calculateBudgetBreakdown,
  computeBudgetSummary,
} from './recommendationEngine';
import { DESTINATIONS } from '../data/destinations';
import { Attraction } from '../types';

test('calculateTripDurationDays calculates inclusive day count accurately', () => {
  assert.equal(calculateTripDurationDays('2026-11-01', '2026-11-03'), 3);
  assert.equal(calculateTripDurationDays('2026-11-01', '2026-11-01'), 1);
  assert.equal(calculateTripDurationDays('', ''), 1);
});

test('scoreAttraction boosts score when interests match', () => {
  const sampleAttraction: Attraction = {
    id: 'test-1',
    name: 'Heritage Fort',
    category: 'Historical places',
    duration_hours: 2,
    cost_inr: 200,
    time_slot_preference: 'Morning',
    description: 'A historic fort',
    location_hint: 'Hilltop',
    recommended_for_interests: ['Historical places', 'Relaxation'],
  };

  const highMatchScore = scoreAttraction(sampleAttraction, ['Historical places'], 'Moderate');
  const lowMatchScore = scoreAttraction(sampleAttraction, ['Beaches'], 'Moderate');

  assert.ok(
    highMatchScore > lowMatchScore,
    `Matching interest score (${highMatchScore}) should be greater than non-matching (${lowMatchScore})`
  );
});

test('generateItineraryDays creates valid day-wise schedule with Morning, Afternoon, Evening', () => {
  const dest = DESTINATIONS[0]; // Jaipur
  const tripDays = generateItineraryDays(
    'trip-test-1',
    dest,
    '2026-12-01',
    3,
    ['Historical places', 'Food'],
    'Moderate',
    { adults: 2, children: 0 }
  );

  assert.equal(tripDays.length, 3, 'Should generate exactly 3 days');
  for (const day of tripDays) {
    assert.equal(day.activities.length, 3, 'Each day should have 3 activities (M, A, E)');
    const slots = day.activities.map((a) => a.time_slot);
    assert.deepEqual(slots, ['Morning', 'Afternoon', 'Evening']);
  }
});

test('calculateBudgetBreakdown and computeBudgetSummary calculate all categories and detect overruns', () => {
  const dest = DESTINATIONS[0];
  const tripDays = generateItineraryDays(
    'trip-test-1',
    dest,
    '2026-12-01',
    2,
    ['Historical places'],
    'Budget',
    { adults: 2, children: 1 }
  );

  const expenses = calculateBudgetBreakdown(
    'trip-test-1',
    dest,
    'Mumbai',
    2,
    { adults: 2, children: 1 },
    'Budget',
    tripDays
  );

  assert.equal(expenses.length, 5, 'Should calculate 5 standard expense categories');

  // Compute with sufficient budget
  const summaryPass = computeBudgetSummary(50000, expenses);
  assert.equal(summaryPass.is_exceeded, false);
  assert.ok(summaryPass.remaining > 0);

  // Compute with insufficient budget
  const summaryFail = computeBudgetSummary(1000, expenses);
  assert.equal(summaryFail.is_exceeded, true);
  assert.ok(summaryFail.remaining < 0);
});
