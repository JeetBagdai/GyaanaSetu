import json
import os

problems = []

def add_problem(title, desc, diff, inf, outf, note, t1, t2, sc_py, sc_ja, sc_cpp):
    problems.append({
        "title": title,
        "description": desc,
        "difficulty": diff,
        "inputFormat": inf,
        "outputFormat": outf,
        "note": note,
        "sampleTestCases": [
            {"input": t1[0], "output": t1[1]},
            {"input": t2[0], "output": t2[1]}
        ],
        "starterCode": {
            "python": sc_py,
            "java": sc_ja,
            "cpp": sc_cpp
        }
    })

sc_py_2i = "import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if len(lines) >= 2:\n        A, B = int(lines[0]), int(lines[1])\n        # Write your logic here\n\nif __name__ == '__main__':\n    solve()"
sc_ja_2i = "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int A = sc.nextInt();\n            int B = sc.nextInt();\n            // Write your logic here\n        }\n    }\n}"
sc_cpp_2i = "#include <iostream>\nusing namespace std;\n\nint main() {\n    int A, B;\n    if (cin >> A >> B) {\n        // Write your logic here\n    }\n    return 0;\n}"

sc_py_3i = "import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if len(lines) >= 3:\n        A, B, C = int(lines[0]), int(lines[1]), int(lines[2])\n        # Write your logic here\n\nif __name__ == '__main__':\n    solve()"
sc_ja_3i = "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int A = sc.nextInt();\n            int B = sc.nextInt();\n            int C = sc.nextInt();\n            // Write your logic here\n        }\n    }\n}"
sc_cpp_3i = "#include <iostream>\nusing namespace std;\n\nint main() {\n    int A, B, C;\n    if (cin >> A >> B >> C) {\n        // Write your logic here\n    }\n    return 0;\n}"

sc_py_1i = "import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if len(lines) >= 1:\n        n = int(lines[0])\n        # Write your logic here\n\nif __name__ == '__main__':\n    solve()"
sc_ja_1i = "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            // Write your logic here\n        }\n    }\n}"
sc_cpp_1i = "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        // Write your logic here\n    }\n    return 0;\n}"

sc_py_1s = "import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if len(lines) >= 1:\n        s = lines[0]\n        # Write your logic here\n\nif __name__ == '__main__':\n    solve()"
sc_ja_1s = "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String s = sc.next();\n            // Write your logic here\n        }\n    }\n}"
sc_cpp_1s = "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    if (cin >> s) {\n        // Write your logic here\n    }\n    return 0;\n}"

sc_py_arr = "import sys\n\ndef solve():\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    n = int(input_data[0])\n    arr = [int(x) for x in input_data[1:n+1]]\n    # Write your logic here\n\nif __name__ == '__main__':\n    solve()"
sc_ja_arr = "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int n = sc.nextInt();\n            int[] arr = new int[n];\n            for(int i=0; i<n; i++) {\n                arr[i] = sc.nextInt();\n            }\n            // Write your logic here\n        }\n    }\n}"
sc_cpp_arr = "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    if (cin >> n) {\n        vector<int> arr(n);\n        for(int i=0; i<n; i++) cin >> arr[i];\n        // Write your logic here\n    }\n    return 0;\n}"

# 1. Half Adder
add_problem(
    "Half Adder Simulator",
    "A half adder is a logic circuit that adds two 1-bit numbers. Given two bits A and B, simulate a half adder by outputting the Sum and Carry bits.",
    "Easy",
    "Two space-separated integers A and B, where each is either 0 or 1.",
    "Two space-separated integers representing Sum and Carry.",
    "Sum = A XOR B, Carry = A AND B.",
    ("0 1", "1 0"),
    ("1 1", "0 1"),
    sc_py_2i, sc_ja_2i, sc_cpp_2i
)

# 2. Full Adder
add_problem(
    "Full Adder Simulator",
    "A full adder adds three 1-bit numbers (A, B, and Cin). Given A, B, and Cin, simulate a full adder by outputting the Sum and Carry (Cout) bits.",
    "Easy",
    "Three space-separated integers A, B, and Cin, where each is either 0 or 1.",
    "Two space-separated integers representing Sum and Cout.",
    "Sum = A XOR B XOR Cin. Cout = (A AND B) OR (Cin AND (A XOR B)).",
    ("0 1 1", "0 1"),
    ("1 1 1", "1 1"),
    sc_py_3i, sc_ja_3i, sc_cpp_3i
)

# 3. Half Subtractor
add_problem(
    "Half Subtractor Simulator",
    "A half subtractor is a logic circuit that subtracts two 1-bit numbers. Given two bits A and B (A - B), simulate a half subtractor by outputting the Difference and Borrow bits.",
    "Easy",
    "Two space-separated integers A and B, where each is either 0 or 1.",
    "Two space-separated integers representing Difference and Borrow.",
    "Difference = A XOR B, Borrow = (NOT A) AND B.",
    ("1 0", "1 0"),
    ("0 1", "1 1"),
    sc_py_2i, sc_ja_2i, sc_cpp_2i
)

# 4. Full Subtractor
add_problem(
    "Full Subtractor Simulator",
    "A full subtractor subtracts a subtrahend and a borrow-in bit from a minuend (A - B - Bin). Given A, B, and Bin, output the Difference and Borrow-out (Bout) bits.",
    "Easy",
    "Three space-separated integers A, B, and Bin, where each is either 0 or 1.",
    "Two space-separated integers representing Difference and Bout.",
    "Difference = A XOR B XOR Bin. Bout = ((NOT A) AND B) OR (((NOT A) XOR B) AND Bin).",
    ("0 1 1", "0 1"),
    ("1 0 0", "1 0"),
    sc_py_3i, sc_ja_3i, sc_cpp_3i
)

# 5. Binary to Gray
add_problem(
    "Binary to Gray Code Converter",
    "Given a binary string of length N, convert it to its corresponding Gray code.",
    "Medium",
    "A single string representing a binary number.",
    "A single string representing the Gray code.",
    "The MSB of Gray code is same as binary. The subsequent bits are G[i] = B[i] XOR B[i-1].",
    ("1010", "1111"),
    ("1101", "1011"),
    sc_py_1s, sc_ja_1s, sc_cpp_1s
)

# 6. Gray to Binary
add_problem(
    "Gray to Binary Code Converter",
    "Given a Gray code string of length N, convert it back to its corresponding binary string.",
    "Medium",
    "A single string representing a Gray code.",
    "A single string representing the Binary number.",
    "The MSB of binary is same as Gray. B[i] = B[i-1] XOR G[i].",
    ("1111", "1010"),
    ("1011", "1101"),
    sc_py_1s, sc_ja_1s, sc_cpp_1s
)

# 7. Multiply Two 16-bit Numbers
add_problem(
    "Multiply Two 16-bit Numbers",
    "Write a program to multiply two 16-bit unsigned integers. Output the 32-bit product.",
    "Easy",
    "Two space-separated integers A and B.",
    "A single integer representing the product.",
    "Simulates an ALP multiplier that stores a 32-bit result.",
    ("100 200", "20000"),
    ("65535 2", "131070"),
    sc_py_2i, sc_ja_2i, sc_cpp_2i
)

# 8. Sum of First N Integers
add_problem(
    "Sum of First N Integers",
    "Write a program to find the sum of the first N natural numbers. (Simulates an assembly loop counting from 1 to N).",
    "Easy",
    "A single integer N.",
    "A single integer representing the sum.",
    "You can use formula N*(N+1)/2 or a loop.",
    ("10", "55"),
    ("100", "5050"),
    sc_py_1i, sc_ja_1i, sc_cpp_1i
)

# 9. Factorial of a Number
add_problem(
    "Factorial of a Number",
    "Write a program to find the factorial of a number N. Output 1 if N=0.",
    "Easy",
    "A single integer N (0 <= N <= 12).",
    "A single integer representing N!.",
    "Simulates a looping multiplication sequence in ALP.",
    ("5", "120"),
    ("0", "1"),
    sc_py_1i, sc_ja_1i, sc_cpp_1i
)

# 10. Add Array of 16-bit Numbers
add_problem(
    "Add Array of 16-bit Numbers",
    "Given an array of N 16-bit unsigned integers, compute their sum and output the 32-bit result. This simulates accumulating memory values in a 32-bit register.",
    "Medium",
    "The first line contains N. The second line contains N space-separated integers.",
    "A single integer representing the sum.",
    "Sum can exceed 16-bit limit.",
    ("3\n100 200 300", "600"),
    ("2\n60000 60000", "120000"),
    sc_py_arr, sc_ja_arr, sc_cpp_arr
)

# 11. Square using Lookup Table
add_problem(
    "Square Using Look-up Table",
    "In embedded systems, lookup tables are used for fast computation. Given a number N, output its square by creating a lookup table for numbers from 1 to 10. If N is outside this range, output -1.",
    "Easy",
    "A single integer N.",
    "A single integer representing the square or -1.",
    "Predefine an array [1, 4, 9, 16, 25, 36, 49, 64, 81, 100].",
    ("5", "25"),
    ("12", "-1"),
    sc_py_1i, sc_ja_1i, sc_cpp_1i
)

# 12. Largest Number in Array
add_problem(
    "Largest Number in an Array",
    "Write a program to find the largest number in a given array of N numbers. This is a common assembly language array manipulation task.",
    "Easy",
    "The first line contains N. The second line contains N space-separated integers.",
    "A single integer representing the maximum value.",
    "Iterate through the array and keep track of the maximum.",
    ("4\n12 56 3 45", "56"),
    ("5\n-1 -5 0 -2 -10", "0"),
    sc_py_arr, sc_ja_arr, sc_cpp_arr
)

# 13. Smallest Number in Array
add_problem(
    "Smallest Number in an Array",
    "Write a program to find the smallest number in a given array of N numbers.",
    "Easy",
    "The first line contains N. The second line contains N space-separated integers.",
    "A single integer representing the minimum value.",
    "Iterate through the array and keep track of the minimum.",
    ("4\n12 56 3 45", "3"),
    ("5\n-1 -5 0 -2 -10", "-10"),
    sc_py_arr, sc_ja_arr, sc_cpp_arr
)

# 14. Sort Array Ascending
add_problem(
    "Sort Array in Ascending Order",
    "Write a program to arrange a series of N numbers in ascending order.",
    "Medium",
    "The first line contains N. The second line contains N space-separated integers.",
    "N space-separated integers representing the sorted array.",
    "Any sorting algorithm like Bubble Sort, Selection Sort or built-in functions can be used.",
    ("4\n12 56 3 45", "3 12 45 56"),
    ("3\n10 10 5", "5 10 10"),
    sc_py_arr, sc_ja_arr, sc_cpp_arr
)

# 15. Sort Array Descending
add_problem(
    "Sort Array in Descending Order",
    "Write a program to arrange a series of N numbers in descending order.",
    "Medium",
    "The first line contains N. The second line contains N space-separated integers.",
    "N space-separated integers representing the sorted array.",
    "Sort the array such that elements are in non-increasing order.",
    ("4\n12 56 3 45", "56 45 12 3"),
    ("3\n10 10 5", "10 10 5"),
    sc_py_arr, sc_ja_arr, sc_cpp_arr
)

# 16. Count Ones in Binary
add_problem(
    "Count Ones in a Binary Number",
    "Given a 32-bit unsigned integer, write a program to count the number of ones (1s) in its binary representation.",
    "Easy",
    "A single integer N.",
    "A single integer representing the count of ones.",
    "Also known as Hamming weight.",
    ("11", "3"),
    ("128", "1"),
    sc_py_1i, sc_ja_1i, sc_cpp_1i
)

# 17. Count Zeros in Binary
add_problem(
    "Count Zeros in a Binary Number",
    "Given a 32-bit unsigned integer, write a program to count the number of zeros (0s) in its 32-bit binary representation.",
    "Medium",
    "A single unsigned integer N (0 <= N <= 2^32 - 1).",
    "A single integer representing the count of zeros.",
    "Ensure you consider the 32-bit format. For N=0, the answer is 32.",
    ("11", "29"),
    ("0", "32"),
    sc_py_1i, sc_ja_1i, sc_cpp_1i
)

sc_py_step = "import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if len(lines) >= 2:\n        S = lines[0]\n        N = int(lines[1])\n        # Write your logic here\n\nif __name__ == '__main__':\n    solve()"
sc_ja_step = "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNext()) {\n            String S = sc.next();\n            int N = sc.nextInt();\n            // Write your logic here\n        }\n    }\n}"
sc_cpp_step = "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string S;\n    int N;\n    if (cin >> S >> N) {\n        // Write your logic here\n    }\n    return 0;\n}"

# 18. Stepper Motor Clockwise Sequence
add_problem(
    "Stepper Motor Sequence (Clockwise)",
    "Simulate the full-step sequence of a stepper motor in clockwise direction. The 4 states are 1000, 0100, 0010, 0001 repeating. Given an initial state (as a 4-bit string) and a number of steps N, output the state reached after N steps.",
    "Medium",
    "A 4-bit string representing the initial state, followed by an integer N.",
    "A 4-bit string representing the final state.",
    "Cycle is 1000 -> 0100 -> 0010 -> 0001 -> 1000...",
    ("1000 1", "0100"),
    ("0010 3", "0100"),
    sc_py_step, sc_ja_step, sc_cpp_step
)

# 19. Stepper Motor Anti-Clockwise
add_problem(
    "Stepper Motor Sequence (Anti-Clockwise)",
    "Simulate the full-step sequence of a stepper motor in anti-clockwise direction. The 4 states are 1000, 0001, 0010, 0100 repeating. Given an initial state and N steps, output the final state.",
    "Medium",
    "A 4-bit string representing the initial state, followed by an integer N.",
    "A 4-bit string representing the final state.",
    "Cycle is 1000 -> 0001 -> 0010 -> 0100 -> 1000...",
    ("1000 1", "0001"),
    ("0010 3", "0001"),
    sc_py_step, sc_ja_step, sc_cpp_step
)

# 20. 7-Segment Encoder
add_problem(
    "7-Segment Display Encoder",
    "In embedded systems, hex digits are displayed using 7-segment displays. Write a program to convert a hex character (0-9, A-F) to its 8-bit binary common-cathode representation. Segments are a,b,c,d,e,f,g,dp. Assume dp is always 0, and mapping is MSB to LSB: dp g f e d c b a. For example, '0' lights up a,b,c,d,e,f -> 00111111.",
    "Hard",
    "A single uppercase character representing the hex digit.",
    "An 8-bit binary string.",
    "Example for '1': lights b,c -> 00000110. '8' lights all except dp -> 01111111.",
    ("0", "00111111"),
    ("1", "00000110"),
    sc_py_1s, sc_ja_1s, sc_cpp_1s
)

# 21. UART Simulator
add_problem(
    "UART Message Simulator",
    "Simulate UART transmission for a given string. For each character, print a 10-bit frame: 1 Start bit (0), 8 Data bits (binary representation of ASCII, LSB first), and 1 Stop bit (1). Output frames space-separated.",
    "Hard",
    "A single string (without spaces).",
    "A space-separated sequence of 10-bit binary strings.",
    "For character 'A' (ASCII 65 = 01000001), LSB first is 10000010. Frame = 0 10000010 1 = 0100000101.",
    ("A", "0100000101"),
    ("Hi", "0000100101 0100101101"),
    sc_py_1s, sc_ja_1s, sc_cpp_1s
)

# 22. DC Motor PWM
add_problem(
    "DC Motor PWM Duty Cycle",
    "Pulse Width Modulation (PWM) controls DC motor speed. Given the total time period T and a duty cycle percentage D, calculate the ON time and OFF time.",
    "Easy",
    "Two space-separated integers T and D.",
    "Two space-separated integers representing ON time and OFF time (rounded down if necessary).",
    "ON = (T * D) / 100. OFF = T - ON.",
    ("1000 75", "750 250"),
    ("500 50", "250 250"),
    sc_py_2i, sc_ja_2i, sc_cpp_2i
)

# 23. Button Press Detector
add_problem(
    "Button Press Edge Detector",
    "A Raspberry Pi reads button states every 10ms. Given a sequence of button states (0 for released, 1 for pressed), count how many distinct button presses occurred. A press is a transition from 0 to 1.",
    "Medium",
    "The first line contains N (number of readings). The second line contains N space-separated states (0 or 1).",
    "A single integer representing the number of presses.",
    "Start by assuming the previous state was 0.",
    ("6\n0 1 1 0 1 0", "2"),
    ("4\n1 1 1 1", "1"),
    sc_py_arr, sc_ja_arr, sc_cpp_arr
)

# 24. LED Toggle Pattern
add_problem(
    "LED Toggle Pattern",
    "An LED is interfaced to a Raspberry Pi and toggled every cycle. Given an initial state (0 or 1) and N cycles, output the sequence of states.",
    "Easy",
    "Two space-separated integers: initial state and N.",
    "A sequence of N space-separated integers representing the state in each cycle.",
    "Example: If initial=0 and N=4, output is 0 1 0 1.",
    ("0 4", "0 1 0 1"),
    ("1 3", "1 0 1"),
    sc_py_2i, sc_ja_2i, sc_cpp_2i
)

sc_py_4i = "import sys\n\ndef solve():\n    lines = sys.stdin.read().split()\n    if len(lines) >= 4:\n        A, B, C, D = int(lines[0]), int(lines[1]), int(lines[2]), int(lines[3])\n        # Write your logic here\n\nif __name__ == '__main__':\n    solve()"
sc_ja_4i = "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (sc.hasNextInt()) {\n            int A = sc.nextInt();\n            int B = sc.nextInt();\n            int C = sc.nextInt();\n            int D = sc.nextInt();\n            // Write your logic here\n        }\n    }\n}"
sc_cpp_4i = "#include <iostream>\nusing namespace std;\n\nint main() {\n    int A, B, C, D;\n    if (cin >> A >> B >> C >> D) {\n        // Write your logic here\n    }\n    return 0;\n}"

# 25. Boolean Evaluator
add_problem(
    "Boolean Expression Evaluator",
    "In the laboratory, you realized expressions using logic gates. Evaluate Y = (A AND B) OR (C AND D) for given binary inputs A, B, C, D.",
    "Easy",
    "Four space-separated integers A, B, C, D (0 or 1).",
    "A single integer representing the output Y (0 or 1).",
    "Simple logical operations.",
    ("1 1 0 0", "1"),
    ("0 1 1 1", "1"),
    sc_py_4i, sc_ja_4i, sc_cpp_4i
)

# 26. Even Parity Generator
add_problem(
    "Even Parity Generator",
    "In communication interfaces like UART, a parity bit is often added. Given an 8-bit binary string, append an EVEN parity bit at the end. Even parity means the total number of 1s in the 9-bit string should be even.",
    "Medium",
    "An 8-bit binary string.",
    "A 9-bit binary string.",
    "If the 8-bit string has an odd number of 1s, append '1', else append '0'.",
    ("10101011", "101010111"),
    ("00000000", "000000000"),
    sc_py_1s, sc_ja_1s, sc_cpp_1s
)

# 27. Odd Parity Generator
add_problem(
    "Odd Parity Generator",
    "Given an 8-bit binary string, append an ODD parity bit at the end. Odd parity means the total number of 1s in the 9-bit string should be odd.",
    "Medium",
    "An 8-bit binary string.",
    "A 9-bit binary string.",
    "If the 8-bit string has an even number of 1s, append '1', else append '0'.",
    ("10101011", "101010110"),
    ("00000000", "000000001"),
    sc_py_1s, sc_ja_1s, sc_cpp_1s
)

# 28. ALU Simulator
add_problem(
    "Arithmetic Logic Unit Simulator",
    "Simulate a basic ALU that takes two integers A and B, and a 2-bit opcode as a string. Operations: 00 -> ADD, 01 -> SUBTRACT (A-B), 10 -> BITWISE AND, 11 -> BITWISE OR. Output the result.",
    "Medium",
    "Two integers A and B, followed by a 2-bit string opcode.",
    "A single integer representing the result.",
    "Be mindful of negative results for SUBTRACT.",
    ("10 5 00", "15"),
    ("12 7 10", "4"),
    sc_py_step, sc_ja_step, sc_cpp_step
)

# 29. Bitwise Set/Clear/Toggle
add_problem(
    "Bitwise Set/Clear/Toggle",
    "In embedded programming, manipulating individual bits is critical. Given an integer N, a bit position P (0 is LSB), and an operation code (1: Set, 2: Clear, 3: Toggle). Output the modified integer.",
    "Medium",
    "Three space-separated integers N, P, and OP.",
    "A single integer representing the new value.",
    "Set turns the bit to 1, Clear to 0, Toggle flips it.",
    ("5 1 1", "7"),
    ("15 0 2", "14"),
    sc_py_3i, sc_ja_3i, sc_cpp_3i
)

# 30. Loop Delay Calculator
add_problem(
    "Loop Delay Calculator",
    "An embedded processor runs a simple delay loop. If one iteration of the loop takes exactly K milliseconds, calculate the number of iterations required to achieve a total delay of exactly D milliseconds. Assume D is a multiple of K.",
    "Easy",
    "Two space-separated integers D and K.",
    "A single integer representing the number of iterations.",
    "Iterations = D / K.",
    ("1000 2", "500"),
    ("50 5", "10"),
    sc_py_2i, sc_ja_2i, sc_cpp_2i
)

with open('c:/Users/Jeet/Desktop/Projects/GyaanaSetu_BNMIT/generated_problems/sem3_MicrocontrollerandEmbeddedSystems.json', 'w') as f:
    json.dump(problems, f, indent=4)
print("JSON written successfully.")
