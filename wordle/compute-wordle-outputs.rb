#!/usr/bin/env ruby

N = ARGV[0].to_i

# Generate all valid comprison outputs for words of length N
results = ['🟩', '🟨', '⬜']
  .repeated_permutation(N).map(&:join)
  .reject { |s| s.count('⬜') == 0 && s.count('🟨') == 1 }

puts results