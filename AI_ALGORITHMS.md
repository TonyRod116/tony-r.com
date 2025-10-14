# AI Algorithm Analysis Configuration
# This file helps CodeRabbit understand and review AI implementations

## Tic-Tac-Toe Minimax Analysis
- **Complexity**: O(b^d) where b=branching factor, d=depth
- **Key Functions**: minimax(), max_value(), min_value()
- **Review Focus**: 
  - Algorithm correctness
  - Performance optimization
  - Edge case handling

## Minesweeper Logical Deduction
- **Complexity**: O(n*m) where n=cells, m=knowledge base size
- **Key Classes**: MinesweeperAI, Sentence
- **Review Focus**:
  - Knowledge base efficiency
  - Logical inference accuracy
  - Memory management

## Six Degrees BFS Implementation
- **Complexity**: O(V + E) where V=vertices, E=edges
- **Key Functions**: shortestPath(), neighborsForPerson()
- **Review Focus**:
  - Graph traversal efficiency
  - Data structure optimization
  - Search space reduction

## Performance Benchmarks
- Tic-Tac-Toe: Target < 1ms per move
- Minesweeper: Target < 100ms for AI solve
- Six Degrees: Target < 2s for path finding

## Code Quality Standards
- Functions should be < 50 lines
- Classes should have single responsibility
- Algorithms should be well-documented
- Error handling for edge cases
