export interface MorseNode {
  char: string | null;
  dot: MorseNode | null;
  dash: MorseNode | null;
}

export const MORSE_MAP: Record<string, string> = {
  '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
  '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
  '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
  '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
  '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
  '--..': 'Z'
};

const buildTree = (): MorseNode => {
  const root: MorseNode = { char: null, dot: null, dash: null };
  
  Object.entries(MORSE_MAP).forEach(([code, char]) => {
    let current = root;
    for (const bit of code) {
      if (bit === '.') {
        if (!current.dot) current.dot = { char: null, dot: null, dash: null };
        current = current.dot;
      } else {
        if (!current.dash) current.dash = { char: null, dot: null, dash: null };
        current = current.dash;
      }
    }
    current.char = char;
  });
  
  return root;
};

export const MORSE_TREE = buildTree();
