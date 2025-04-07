import wordsToNumbers from "words-to-numbers";

function extractNumber(str: string): number | null {
  str = str.replace(/,/g, "");
  str = str.toLowerCase();
  if (str.includes("billion")) {
    const num = parseFloat(str.replace(/billion.*$/, ""));
    return num * 1000000000;
  }
  if (str.includes("million")) {
    const num = parseFloat(str.replace(/million.*$/, ""));
    return num * 1000000;
  }

  console.log("strstr", str);

  if (str.includes("-")) {
    const [min, max] = str.split("-").map((num) => parseFloat(num));
    return (min + max) / 2; // Return average of range
  }

  const match = str.match(/^(\d*\.?\d+)c?$/i);
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

const checkRelatedFact = (facts: any, whole?: any): any => {
  const sameUnit =
    facts[0]?.unit && facts.every((fact: any) => fact.unit === facts[0].unit);

  if (
    sameUnit &&
    (facts[0].type === "quantity_whole" ||
      facts[0].type === "quantity_part" ||
      facts[0].type === "change_increase" ||
      facts[0].type === "change_decrease")
  ) {
    const numbers = facts.map((fact: any) => {
      const parsed = extractNumber(fact.number);
      console.log("parsed", parsed, fact.number);
      return parsed !== undefined ? parsed : null;
    });

    if (numbers.every((n: any) => n !== null)) {
      const max = Math.max(...numbers);
      const min = Math.min(...numbers);
      if (max / min > 7) {
        return {
          isRelated: false,
          type: "quantity",
          numbers: numbers,
        };
      }
    }

    const sum = numbers.reduce(
      (acc: number, curr: number) =>
        curr !== undefined && curr !== null ? acc + curr : acc,
      0
    );

    if (sum < whole?.number) {
      const remainingValue = whole?.number - sum;
      numbers.push(remainingValue);
      return {
        isRelated: true,
        type: "quantity",
        numbers: numbers,
      };
    }

    return {
      isRelated: true,
      type: "quantity",
      numbers: numbers,
    };
  }

  if (sameUnit && facts[0].type === "proportion") {
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

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#FF69B4",
  "#9370DB",
];

export {
  parseNumberString,
  checkRelatedFact,
  separateNumbersText,
  extractPercentage,
  COLORS,
};
