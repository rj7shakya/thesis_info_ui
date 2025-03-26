import wordsToNumbers from "words-to-numbers";

function extractNumber(str: string): number | null {
  const match = str.match(/^(\d*\.?\d+)/);

  if (match) {
    return parseFloat(match[1]);
  }

  return null;
}

function parseNumberString(numStr: string) {
  numStr = numStr.toLowerCase().trim();
  let parts = numStr.split(/\s*[-\s]*(?:in|out of|-)\s*/i);

  if (parts.length > 1) {
    let num1: any = wordsToNumbers(parts[0]) || parseFloat(parts[0]);
    let num2: any = wordsToNumbers(parts[1]) || parseFloat(parts[1]);

    if (!isNaN(num1) && !isNaN(num2)) {
      let value: any = ((num1 / num2) * 100).toFixed(2);
      return [parseFloat(value), parseFloat((100 - value).toFixed(2))];
    }
  }

  let percentMatch = numStr.match(/(\d+(\.\d+)?)%/);
  if (percentMatch) {
    let value = parseFloat(percentMatch[1]);
    return [value, 100 - value];
  }

  let fractionMap: any = {
    half: 1 / 2,
    quarter: 1 / 4,
  };

  if (fractionMap[numStr]) {
    let value: any = (fractionMap[numStr] * 100).toFixed(2);
    return [parseFloat(value), parseFloat((100 - value).toFixed(2))];
  }

  return [];
}

const checkRelatedFact = (facts: any): any => {
  const sameSubject = facts.every(
    (fact: any) => fact.subject === facts[0].subject
  );

  if (sameSubject && facts[0].type === "quantity_whole") {
    const numbers = facts.map((fact: any) => {
      const parsed = extractNumber(fact.number);
      return parsed !== undefined ? parsed : null;
    });
    return {
      isRelated: true,
      type: "quantity",
      numbers: numbers,
    };
  }

  if (sameSubject && facts[0].type === "proportion") {
    const numbers = facts
      .map((fact: any) => {
        const parsed = parseNumberString(fact.number)[0];
        return parsed !== undefined ? parsed : null;
      })
      .filter((num: any) => num !== null);
    const sum = numbers.reduce(
      (acc: number, curr: number) =>
        curr !== undefined && curr !== null ? acc + curr : acc,
      0
    );

    if (sum === 100) {
      return {
        isRelated: true,
        type: "proportion",
        numbers: numbers,
      };
    } else if (sum > 100) {
      return {
        isRelated: false,
        type: "proportion",
        numbers: numbers,
      };
    } else {
      const remainingValue = 100 - sum;
      numbers.push(remainingValue);
      return {
        isRelated: true,
        type: "proportion",
        numbers: numbers,
      };
    }
  }

  return false;
};

function separateNumbersText(text?: string): (string | number)[] {
  if (!text) return [];
  const matches = text.match(/(\d+[\.,]?\d*)|([^\d.,]+)/g);
  if (!matches) return [];

  return matches
    .map((part) => part.trim()) // Trim spaces
    .filter((part) => part) // Remove empty elements
    .map((part) =>
      isNaN(Number(part.replace(",", ".")))
        ? part
        : Number(part.replace(",", ""))
    ); // Convert valid numbers
}

function extractPercentage(text: string) {
  const match = text.match(/(\d+)%/); // Match a number followed by '%'
  return match ? Number(match[1]) : null; // Convert to Number, return null if not found
}

export {
  parseNumberString,
  checkRelatedFact,
  separateNumbersText,
  extractPercentage,
};
