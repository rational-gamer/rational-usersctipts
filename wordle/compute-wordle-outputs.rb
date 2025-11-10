#!/usr/bin/env ruby
require 'json'

# Unicode characters for Wordle colors
🟩 = '🟩'
🟨 = '🟨'
⬜ = '⬜'

# Validate and parse input
n = ARGV[0].to_i
if n <= 0
  puts "Please provide a positive integer for word length."
  exit 1
end

# Generate all combinations
results = [🟩, 🟨, ⬜]
  .repeated_permutation(n)
  .map(&:join)
  .reject { |s| s.count(🟩) == n - 1 && s.count(🟨) == 1 }

# Output as formatted JSON array
puts JSON.pretty_generate(results)