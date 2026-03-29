const EDGE_TYPES = {
  FLAT: 'flat',
  TAB: 'tab',
  SLOT: 'slot',
};

function generateEdgeType(isBorder = false) {
  if (isBorder) {
    return EDGE_TYPES.FLAT;
  }
  const rand = Math.random();
  if (rand < 0.4) {
    return EDGE_TYPES.FLAT;
  } else if (rand < 0.7) {
    return EDGE_TYPES.TAB;
  } else {
    return EDGE_TYPES.SLOT;
  }
}

function ensureMatchingEdges(pieces, rows, cols) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      const piece = pieces[index];

      if (col === cols - 1) {
        piece.rightEdge = EDGE_TYPES.FLAT;
      } else {
        const rightNeighbor = pieces[index + 1];
        if (piece.rightEdge === EDGE_TYPES.TAB) {
          rightNeighbor.leftEdge = EDGE_TYPES.SLOT;
        } else if (piece.rightEdge === EDGE_TYPES.SLOT) {
          rightNeighbor.leftEdge = EDGE_TYPES.TAB;
        }
      }

      if (row === rows - 1) {
        piece.bottomEdge = EDGE_TYPES.FLAT;
      } else {
        const bottomNeighbor = pieces[index + cols];
        if (piece.bottomEdge === EDGE_TYPES.TAB) {
          bottomNeighbor.topEdge = EDGE_TYPES.SLOT;
        } else if (piece.bottomEdge === EDGE_TYPES.SLOT) {
          bottomNeighbor.topEdge = EDGE_TYPES.TAB;
        }
      }
    }
  }
}

export function splitImage(imageCanvas, rows, cols) {
  const pieces = [];
  const pieceWidth = imageCanvas.width / cols;
  const pieceHeight = imageCanvas.height / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;

      const isTopBorder = row === 0;
      const isBottomBorder = row === rows - 1;
      const isLeftBorder = col === 0;
      const isRightBorder = col === cols - 1;

      pieces.push({
        id: index,
        correctPosition: index,
        currentImage: null,
        topEdge: generateEdgeType(isTopBorder),
        rightEdge: generateEdgeType(isRightBorder),
        bottomEdge: generateEdgeType(isBottomBorder),
        leftEdge: generateEdgeType(isLeftBorder),
      });
    }
  }

  ensureMatchingEdges(pieces, rows, cols);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col;
      const piece = pieces[index];

      const pieceCanvas = document.createElement('canvas');
      pieceCanvas.width = pieceWidth;
      pieceCanvas.height = pieceHeight;

      const ctx = pieceCanvas.getContext('2d');
      ctx.drawImage(
        imageCanvas,
        col * pieceWidth,
        row * pieceHeight,
        pieceWidth,
        pieceHeight,
        0,
        0,
        pieceWidth,
        pieceHeight
      );

      piece.currentImage = pieceCanvas;
    }
  }

  return pieces;
}

function countInversions(positions) {
  let inversions = 0;
  const filtered = positions.filter(p => p !== -1);

  for (let i = 0; i < filtered.length - 1; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      if (filtered[i] > filtered[j]) {
        inversions++;
      }
    }
  }

  return inversions;
}

function isSolvable(pieces, rows, cols) {
  const positions = pieces.map(p => p.correctPosition);
  const emptyIndex = pieces.findIndex(p => p.correctPosition === -1);
  const emptyRowFromBottom = rows - Math.floor(emptyIndex / cols);
  const inversions = countInversions(positions);

  if (cols % 2 === 1) {
    return inversions % 2 === 0;
  } else {
    if (emptyRowFromBottom % 2 === 0) {
      return inversions % 2 === 1;
    } else {
      return inversions % 2 === 0;
    }
  }
}

export function shufflePuzzle(pieces, rows, cols) {
  const shuffled = [...pieces];

  do {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (!isSolvable(shuffled, rows, cols) || isPuzzleComplete(shuffled));

  shuffled.forEach((piece, index) => {
    piece.currentIndex = index;
  });

  return shuffled;
}

export function canMove(pieceIndex, emptyIndex, rows, cols) {
  const pieceRow = Math.floor(pieceIndex / cols);
  const pieceCol = pieceIndex % cols;
  const emptyRow = Math.floor(emptyIndex / cols);
  const emptyCol = emptyIndex % cols;

  const rowDiff = Math.abs(pieceRow - emptyRow);
  const colDiff = Math.abs(pieceCol - emptyCol);

  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

export function movePiece(pieces, fromIndex, toIndex) {
  const newPieces = [...pieces];

  [newPieces[fromIndex], newPieces[toIndex]] = [newPieces[toIndex], newPieces[fromIndex]];

  newPieces.forEach((piece, index) => {
    piece.currentIndex = index;
  });

  return newPieces;
}

export function isPuzzleComplete(pieces) {
  return pieces.every((piece, index) => piece.correctPosition === index);
}

export function findEmptyPiece(pieces) {
  return pieces.findIndex(piece => piece.correctPosition === -1);
}

export function createEmptyPiece() {
  const emptyCanvas = document.createElement('canvas');
  emptyCanvas.width = 100;
  emptyCanvas.height = 100;

  return {
    id: -1,
    correctPosition: -1,
    currentImage: emptyCanvas,
    topEdge: EDGE_TYPES.FLAT,
    rightEdge: EDGE_TYPES.FLAT,
    bottomEdge: EDGE_TYPES.FLAT,
    leftEdge: EDGE_TYPES.FLAT,
  };
}

export function generateClipPath(piece, pieceWidth, pieceHeight, tabSize = 0.15) {
  const tab = Math.min(pieceWidth, pieceHeight) * tabSize;
  const w = pieceWidth;
  const h = pieceHeight;

  const points = [];

  points.push({ x: 0, y: 0 });

  if (piece.topEdge === EDGE_TYPES.TAB) {
    points.push({ x: w * 0.5 - tab * 0.5, y: 0 });
    points.push({ x: w * 0.5 - tab * 0.5, y: -tab * 0.5 });
    points.push({ x: w * 0.5 + tab * 0.5, y: -tab * 0.5 });
    points.push({ x: w * 0.5 + tab * 0.5, y: 0 });
  } else if (piece.topEdge === EDGE_TYPES.SLOT) {
    points.push({ x: w * 0.5 - tab * 0.5, y: 0 });
    points.push({ x: w * 0.5 - tab * 0.5, y: tab * 0.5 });
    points.push({ x: w * 0.5 + tab * 0.5, y: tab * 0.5 });
    points.push({ x: w * 0.5 + tab * 0.5, y: 0 });
  }

  points.push({ x: w, y: 0 });

  if (piece.rightEdge === EDGE_TYPES.TAB) {
    points.push({ x: w, y: h * 0.5 - tab * 0.5 });
    points.push({ x: w + tab * 0.5, y: h * 0.5 - tab * 0.5 });
    points.push({ x: w + tab * 0.5, y: h * 0.5 + tab * 0.5 });
    points.push({ x: w, y: h * 0.5 + tab * 0.5 });
  } else if (piece.rightEdge === EDGE_TYPES.SLOT) {
    points.push({ x: w, y: h * 0.5 - tab * 0.5 });
    points.push({ x: w - tab * 0.5, y: h * 0.5 - tab * 0.5 });
    points.push({ x: w - tab * 0.5, y: h * 0.5 + tab * 0.5 });
    points.push({ x: w, y: h * 0.5 + tab * 0.5 });
  }

  points.push({ x: w, y: h });

  if (piece.bottomEdge === EDGE_TYPES.TAB) {
    points.push({ x: w * 0.5 + tab * 0.5, y: h });
    points.push({ x: w * 0.5 + tab * 0.5, y: h + tab * 0.5 });
    points.push({ x: w * 0.5 - tab * 0.5, y: h + tab * 0.5 });
    points.push({ x: w * 0.5 - tab * 0.5, y: h });
  } else if (piece.bottomEdge === EDGE_TYPES.SLOT) {
    points.push({ x: w * 0.5 + tab * 0.5, y: h });
    points.push({ x: w * 0.5 + tab * 0.5, y: h - tab * 0.5 });
    points.push({ x: w * 0.5 - tab * 0.5, y: h - tab * 0.5 });
    points.push({ x: w * 0.5 - tab * 0.5, y: h });
  }

  points.push({ x: 0, y: h });

  if (piece.leftEdge === EDGE_TYPES.TAB) {
    points.push({ x: 0, y: h * 0.5 + tab * 0.5 });
    points.push({ x: -tab * 0.5, y: h * 0.5 + tab * 0.5 });
    points.push({ x: -tab * 0.5, y: h * 0.5 - tab * 0.5 });
    points.push({ x: 0, y: h * 0.5 - tab * 0.5 });
  } else if (piece.leftEdge === EDGE_TYPES.SLOT) {
    points.push({ x: 0, y: h * 0.5 + tab * 0.5 });
    points.push({ x: tab * 0.5, y: h * 0.5 + tab * 0.5 });
    points.push({ x: tab * 0.5, y: h * 0.5 - tab * 0.5 });
    points.push({ x: 0, y: h * 0.5 - tab * 0.5 });
  }

  return points;
}

export function getClipPathString(piece, pieceWidth, pieceHeight) {
  const points = generateClipPath(piece, pieceWidth, pieceHeight);
  const pathParts = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`);
  pathParts.push('Z');
  return pathParts.join(' ');
}