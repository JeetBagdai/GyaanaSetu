import fs from 'fs';

const env = fs.readFileSync('.env', 'utf8');
const projectMatch = env.match(/VITE_FIREBASE_PROJECT_ID=(.*)/);
const PROJECT = projectMatch ? projectMatch[1].trim() : 'gyaanasetu-bnmit';

async function addProblem() {
  const id = 'prob-sem3-add';
  const body = {
    fields: {
      title: { stringValue: 'Add Two Numbers' },
      description: { stringValue: 'Write a program that takes two integers as input and prints their sum.' },
      difficulty: { stringValue: 'Easy' },
      semester: { stringValue: '3' },
      subject: { stringValue: 'COA' }, // Example subject, adjust if needed
      proctored: { booleanValue: true },
      inputFormat: { stringValue: 'The first line contains an integer A.\nThe second line contains an integer B.' },
      outputFormat: { stringValue: 'Print the sum of A and B.' },
      note: { stringValue: 'Use standard input/output methods in Python.' },
      sampleTestCases: {
        arrayValue: {
          values: [
            {
              mapValue: {
                fields: {
                  input: { stringValue: '5\n7' },
                  output: { stringValue: '12' }
                }
              }
            },
            {
              mapValue: {
                fields: {
                  input: { stringValue: '-3\n10' },
                  output: { stringValue: '7' }
                }
              }
            }
          ]
        }
      },
      starterCode: {
        mapValue: {
          fields: {
            python: { stringValue: 'a = int(input())\nb = int(input())\n\n# Calculate and print sum\n' },
            java: { stringValue: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        int a = scanner.nextInt();\n        int b = scanner.nextInt();\n        // Calculate and print sum\n    }\n}\n' },
            cpp: { stringValue: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Calculate and print sum\n    return 0;\n}\n' }
          }
        }
      }
    }
  };

  const updateUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/coding_problems/${id}`;

  const patchRes = await fetch(updateUrl, {
    method: 'PATCH', // Using PATCH without updateMask creates or overwrites the document
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  
  if (patchRes.ok) {
    console.log(`Successfully created problem ${id}`);
  } else {
    console.error(`Failed to create ${id}`, await patchRes.text());
  }
}

addProblem();
