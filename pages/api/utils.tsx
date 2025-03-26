export const extractFacts = async (nerResults: any, text: string) => {
  let statements = [];
  let currentStatement = [];
  let currentNumber = [];
  let currentSubject = [];
  let prevObj = null;
  let prevSubject: string[] = [];

  for (let i = 0; i < nerResults.length; i++) {
    if (!prevObj && nerResults[i].start > 0) {
      currentStatement.push(text.slice(0, nerResults[i].start));
    }
    if (prevObj && nerResults[i].start - prevObj.end > 1) {
      currentStatement.push(text.slice(prevObj.end, nerResults[i].start));
    }

    let { word, entity_group: tag } = nerResults[i];

    if (tag.startsWith("before") || tag.startsWith("number")) {
      if (
        currentStatement.length > 1 &&
        currentNumber.length > 0 &&
        currentNumber[0].length > 0
      ) {
        statements.push({
          statement: currentStatement.join(" "),
          number: currentNumber.join(" "),
          subject: currentSubject.length
            ? currentSubject.join(" ")
            : prevSubject.join(" ") ?? "Unknown",
        });
        currentStatement = [];
        currentNumber = [];
        prevSubject = currentSubject.length ? currentSubject : prevSubject;
        currentSubject = [];
      }
    }

    if (tag.startsWith("number")) currentNumber.push(word);
    if (tag.startsWith("subject")) currentSubject.push(word);

    currentStatement.push(word);
    prevObj = nerResults[i];
  }

  if (currentStatement.length && currentNumber.length) {
    statements.push({
      statement: currentStatement.join(" "),
      number: currentNumber.join(" "),
      subject: currentSubject.length ? currentSubject.join(" ") : "Unknown",
    });
  }

  return statements;
};

const labelMapping: Record<string, string> = {
  LABEL_0: "proportion",
  LABEL_1: "quantity_whole",
  LABEL_2: "change_increase",
  LABEL_3: "quantity_part",
  LABEL_4: "change_decrease",
};

export const getHighestLabel = (
  data: { label: string; score: number }[][]
): string => {
  if (!data.length || !data[0].length) return "No data available";

  const highestLabel = data[0].reduce((max, item) =>
    item.score > max.score ? item : max
  );

  return labelMapping[highestLabel.label] || highestLabel.label;
};

export const transformData = (data: any) => {
  const { statement, number, subject } = data;
  const numberIndex = statement.indexOf(number);

  if (numberIndex === -1) {
    throw new Error("Number not found in statement.");
  }

  const before = statement.substring(0, numberIndex).trim();
  const after = statement.substring(numberIndex + number.length).trim();

  return { before, number, after, subject, ...data };
};
