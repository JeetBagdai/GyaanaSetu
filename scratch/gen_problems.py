import json
import os

problems = []

# Task 1: Basics
problems.append({
    'title': 'Welcome Messages',
    'description': 'Write a program to display the message \'Welcome to BNMIT\' on one line and \'I am first batch of Autonomous\' on the next line. (Ignore input)',
    'difficulty': 'Easy',
    'inputFormat': 'None',
    'outputFormat': 'Two lines of text.',
    'note': 'Exact match required.',
    'sampleTestCases': [
        {'input': '', 'output': 'Welcome to BNMIT\nI am first batch of Autonomous'},
        {'input': 'abc', 'output': 'Welcome to BNMIT\nI am first batch of Autonomous'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Quadratic Equation Solver',
    'description': 'Write a program that prints real solutions to the quadratic equation ax^2 + bx + c = 0. Print the roots separated by space in ascending order. If roots are imaginary, print \'No real roots\'. If roots are equal, print it once.',
    'difficulty': 'Medium',
    'inputFormat': 'Three integers a, b, c separated by space.',
    'outputFormat': 'Real roots or \'No real roots\'.',
    'note': 'Assume inputs will not be a=0.',
    'sampleTestCases': [
        {'input': '1 -3 2', 'output': '1.0 2.0'},
        {'input': '1 0 1', 'output': 'No real roots'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();\n            // Write your code here\n        }\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b, c;\n    if(cin >> a >> b >> c) {\n        // Write your code here\n    }\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Student Information Display',
    'description': 'Create a class Student with USN, name, branch, and semester. Read data for N students and display them in the format: "[USN] - [Name] - [Branch] - [Semester]".',
    'difficulty': 'Easy',
    'inputFormat': 'First line contains integer N. Following N lines contain USN, name, branch, semester separated by space.',
    'outputFormat': 'N lines with student information.',
    'note': 'Input strings will not contain spaces.',
    'sampleTestCases': [
        {'input': '2\n1BM20CS001 Alice CSE 3\n1BM20CS002 Bob ISE 3', 'output': '1BM20CS001 - Alice - CSE - 3\n1BM20CS002 - Bob - ISE - 3'},
        {'input': '1\n1BM20AI001 Charlie AIML 3', 'output': '1BM20AI001 - Charlie - AIML - 3'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            // Write your code here\n        }\n    }\n}',
        'cpp': '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    int n;\n    if(cin >> n) {\n        // Write your code here\n    }\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Sum of Arrays',
    'description': 'Write a program to add two integer arrays of size N element-wise and print the result.',
    'difficulty': 'Easy',
    'inputFormat': 'Integer N, followed by N integers of array 1, followed by N integers of array 2.',
    'outputFormat': 'N integers representing the element-wise sum.',
    'note': '',
    'sampleTestCases': [
        {'input': '3\n1 2 3\n4 5 6', 'output': '5 7 9'},
        {'input': '2\n10 -2\n-5 5', 'output': '5 3'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNextInt()) {\n            int n = sc.nextInt();\n            // Write your code here\n        }\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    if(cin >> n) {\n        // Write your code here\n    }\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Operator Overloading / Switch Case Calculator',
    'description': 'Implement a simple calculator to perform addition, subtraction, multiplication, and division. Read two integers and an operator (+, -, *, /) and print the result. For division, perform integer division. If division by zero, print "Error".',
    'difficulty': 'Easy',
    'inputFormat': 'Two integers and a character operator.',
    'outputFormat': 'Integer result or "Error".',
    'note': '',
    'sampleTestCases': [
        {'input': '10 5 +', 'output': '15'},
        {'input': '10 0 /', 'output': 'Error'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if(sc.hasNext()) {\n            int a = sc.nextInt(), b = sc.nextInt();\n            String op = sc.next();\n            // Write your code here\n        }\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    int a, b;\n    char op;\n    if(cin >> a >> b >> op) {\n        // Write your code here\n    }\n    return 0;\n}'
    }
})

# Task 2: Method overloading, Inheritance, polymorphism, encapsulation
problems.append({
    'title': 'Area Overloading',
    'description': 'Calculate area of Rectangle, Triangle, and Circle by using method overloading. Input is a string (Rectangle, Triangle, Circle) followed by its dimensions (length breadth / base height / radius). Print area with 2 decimal places.',
    'difficulty': 'Medium',
    'inputFormat': 'Shape name followed by dimensions (integers).',
    'outputFormat': 'Area rounded to 2 decimal places.',
    'note': 'Use PI=3.14159',
    'sampleTestCases': [
        {'input': 'Rectangle 4 5', 'output': '20.00'},
        {'input': 'Circle 3', 'output': '28.27'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\n#include <iomanip>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Vehicle Encapsulation',
    'description': 'Create a class Vehicle with private string "brand". Create a subclass Car. Set the brand via a setter and get it via a getter. Read N car brands and print them.',
    'difficulty': 'Easy',
    'inputFormat': 'Integer N, followed by N string brands.',
    'outputFormat': 'N lines of brands.',
    'note': '',
    'sampleTestCases': [
        {'input': '2\nToyota Honda', 'output': 'Toyota\nHonda'},
        {'input': '1\nBMW', 'output': 'BMW'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Dynamic Polymorphism with Shapes',
    'description': 'Develop a hierarchy with base class Shape and subclasses Rectangle and Circle. Both implement printArea(). Input N shapes (1 for Rectangle, 2 for Circle), followed by dimensions. Print areas (integer for rectangle, 2 decimal for circle using 3.14159).',
    'difficulty': 'Medium',
    'inputFormat': 'N, then N queries. Query: type (1 or 2) then dimensions.',
    'outputFormat': 'N lines of areas.',
    'note': '',
    'sampleTestCases': [
        {'input': '2\n1 4 5\n2 3', 'output': '20\n28.27'},
        {'input': '1\n1 10 10', 'output': '100'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Multilevel Inheritance: Employee hierarchy',
    'description': 'Create an Employee class, extend it to Faculty, and then to Professor. Access a variable "salary" from base class using super. Read base salary and print professor salary (base + 10000).',
    'difficulty': 'Easy',
    'inputFormat': 'One integer: base salary.',
    'outputFormat': 'One integer: professor salary.',
    'note': '',
    'sampleTestCases': [
        {'input': '50000', 'output': '60000'},
        {'input': '30000', 'output': '40000'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Abstract Class Shape',
    'description': 'Create an abstract class Shape with two integers and an empty method printArea(). Implement it in Rectangle (prints a*b) and Triangle (prints 0.5*a*b, 1 decimal place). Input N shapes (R or T) and 2 integers. Print their areas.',
    'difficulty': 'Medium',
    'inputFormat': 'N, then N lines containing R or T and 2 integers.',
    'outputFormat': 'N lines with areas.',
    'note': '',
    'sampleTestCases': [
        {'input': '2\nR 4 5\nT 4 5', 'output': '20\n10.0'},
        {'input': '1\nT 3 3', 'output': '4.5'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

# Task 3: Enumerations, Strings
problems.append({
    'title': 'Restaurant Enum',
    'description': 'Create an enum of restaurants (ITALIAN, CHINESE, INDIAN). Read an integer (1=ITALIAN, 2=CHINESE, 3=INDIAN) and print the enum name. If out of range, print "INVALID".',
    'difficulty': 'Easy',
    'inputFormat': 'An integer.',
    'outputFormat': 'Restaurant name or INVALID.',
    'note': '',
    'sampleTestCases': [
        {'input': '2', 'output': 'CHINESE'},
        {'input': '5', 'output': 'INVALID'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Vowel Extractor',
    'description': 'Given a string, extraction option (0 for non-vowels, 1 for vowels), and case option (0 for lowercase, 1 for UPPERCASE), extract and return the processed string. Vowels are a,e,i,o,u.',
    'difficulty': 'Medium',
    'inputFormat': 'String, followed by two integers (extraction and case).',
    'outputFormat': 'Processed string.',
    'note': '',
    'sampleTestCases': [
        {'input': 'Hello 1 1', 'output': 'EO'},
        {'input': 'Hello 0 0', 'output': 'hll'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Duplicate Words Count',
    'description': 'Find duplicate words and their number of occurrences in a string. Print words and counts in lexicographical order. Only print words that occur >1 time.',
    'difficulty': 'Hard',
    'inputFormat': 'A string (single line).',
    'outputFormat': 'Multiple lines: "Word: Count"',
    'note': 'Case sensitive.',
    'sampleTestCases': [
        {'input': 'hello world hello', 'output': 'hello: 2'},
        {'input': 'a a b b c', 'output': 'a: 2\nb: 2'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Regex Substring Replace',
    'description': 'Replace each substring of a given string that matches the regex "[0-9]+" with the string "NUM".',
    'difficulty': 'Medium',
    'inputFormat': 'A single string.',
    'outputFormat': 'Modified string.',
    'note': '',
    'sampleTestCases': [
        {'input': 'abc123def45', 'output': 'abcNUMdefNUM'},
        {'input': 'hello', 'output': 'hello'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Palindrome Check',
    'description': 'Check if a given string is a palindrome. Print "Yes" or "No".',
    'difficulty': 'Easy',
    'inputFormat': 'A single string.',
    'outputFormat': 'Yes or No.',
    'note': '',
    'sampleTestCases': [
        {'input': 'madam', 'output': 'Yes'},
        {'input': 'racecar', 'output': 'Yes'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

# Task 4: Exception Handling
problems.append({
    'title': 'Out of Range Exception',
    'description': 'If number is less than 10 or greater than 50 it generates an "Out of range" exception message. Else it displays the square of the number.',
    'difficulty': 'Easy',
    'inputFormat': 'An integer.',
    'outputFormat': 'Square of the number or "Out of range".',
    'note': '',
    'sampleTestCases': [
        {'input': '12', 'output': '144'},
        {'input': '5', 'output': 'Out of range'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Arithmetic Exception',
    'description': 'Read two numbers. Divide the first number by the second. If the second number is 0, catch ArithmeticException and print "Divide by Zero Error". Otherwise print the quotient.',
    'difficulty': 'Easy',
    'inputFormat': 'Two integers.',
    'outputFormat': 'Quotient or "Divide by Zero Error".',
    'note': '',
    'sampleTestCases': [
        {'input': '10 2', 'output': '5'},
        {'input': '10 0', 'output': 'Divide by Zero Error'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Input Format Exception',
    'description': 'Read a string. Try to parse it to an integer. If it fails, catch the exception and print "Invalid Input". Else print the integer multiplied by 2.',
    'difficulty': 'Easy',
    'inputFormat': 'A single string.',
    'outputFormat': 'Integer or "Invalid Input".',
    'note': '',
    'sampleTestCases': [
        {'input': '123', 'output': '246'},
        {'input': 'abc', 'output': 'Invalid Input'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Custom Exception for Negative Numbers',
    'description': 'Read N numbers. For each number, if it is negative, throw a custom exception and print "Negative Number Exception". Else print the number.',
    'difficulty': 'Medium',
    'inputFormat': 'N followed by N integers.',
    'outputFormat': 'N lines of output.',
    'note': '',
    'sampleTestCases': [
        {'input': '2\n5 -1', 'output': '5\nNegative Number Exception'},
        {'input': '1\n10', 'output': '10'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Multiple Exceptions',
    'description': 'Read an array of size 5. Then read an index and a divisor. Divide the array element at the given index by the divisor. Catch ArrayIndexOutOfBoundsException (print "Index Error") and ArithmeticException (print "Math Error"). Otherwise print the quotient.',
    'difficulty': 'Medium',
    'inputFormat': '5 integers for array, then index and divisor.',
    'outputFormat': 'Quotient or Error message.',
    'note': '',
    'sampleTestCases': [
        {'input': '10 20 30 40 50\n2 5', 'output': '6'},
        {'input': '10 20 30 40 50\n5 5', 'output': 'Index Error'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

# Task 5: Multithreaded Programming
problems.append({
    'title': 'Thread Sleep',
    'description': 'Simulate a thread that prints "Thread Running" 3 times, waiting 1 second between each print. (For testing, ignore the sleep time and just print the message 3 times on separate lines).',
    'difficulty': 'Easy',
    'inputFormat': 'None',
    'outputFormat': '3 lines of "Thread Running".',
    'note': '',
    'sampleTestCases': [
        {'input': '', 'output': 'Thread Running\nThread Running\nThread Running'},
        {'input': 'a', 'output': 'Thread Running\nThread Running\nThread Running'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Random Number Square and Cube Threads',
    'description': 'Implement a program simulating three threads. First generates a random integer. If even, second thread prints its square. If odd, third thread prints its cube. Given a list of N integers (to simulate the random generation), process each integer as described.',
    'difficulty': 'Medium',
    'inputFormat': 'N followed by N integers.',
    'outputFormat': 'N lines with square or cube.',
    'note': '',
    'sampleTestCases': [
        {'input': '3\n2 3 4', 'output': '4\n27\n16'},
        {'input': '1\n5', 'output': '125'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Producer Consumer Simulation',
    'description': 'Simulate the producer consumer problem. Given an array of integers, output the elements consumed one by one. Print "Produced: [x]" and "Consumed: [x]" for each.',
    'difficulty': 'Medium',
    'inputFormat': 'N followed by N integers.',
    'outputFormat': '2N lines.',
    'note': '',
    'sampleTestCases': [
        {'input': '2\n10 20', 'output': 'Produced: 10\nConsumed: 10\nProduced: 20\nConsumed: 20'},
        {'input': '1\n5', 'output': 'Produced: 5\nConsumed: 5'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Multi-thread Display',
    'description': 'Execute two threads: Thread A prints "A" N times, Thread B prints "B" N times. Output should be A and B alternating (simulated).',
    'difficulty': 'Easy',
    'inputFormat': 'Integer N.',
    'outputFormat': '2N lines alternating A and B.',
    'note': '',
    'sampleTestCases': [
        {'input': '2', 'output': 'A\nB\nA\nB'},
        {'input': '1', 'output': 'A\nB'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Thread Priorities',
    'description': 'Simulate setting thread priorities. Print "Max Priority: 10", "Norm Priority: 5", "Min Priority: 1".',
    'difficulty': 'Easy',
    'inputFormat': 'None',
    'outputFormat': '3 lines exactly as specified.',
    'note': '',
    'sampleTestCases': [
        {'input': '', 'output': 'Max Priority: 10\nNorm Priority: 5\nMin Priority: 1'},
        {'input': '0', 'output': 'Max Priority: 10\nNorm Priority: 5\nMin Priority: 1'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

# Task 6: Collections
problems.append({
    'title': 'ArrayList Colors',
    'description': 'Create a new array list, add N colors (strings), and print out the collection elements space separated.',
    'difficulty': 'Easy',
    'inputFormat': 'N followed by N color names.',
    'outputFormat': 'Space separated color names.',
    'note': '',
    'sampleTestCases': [
        {'input': '3\nRed Green Blue', 'output': 'Red Green Blue'},
        {'input': '2\nYellow Black', 'output': 'Yellow Black'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Iterate Linked List',
    'description': 'Iterate through all elements in a linked list starting at the specified position. Given N elements, and start index P (0-based). Print elements from P to N-1.',
    'difficulty': 'Medium',
    'inputFormat': 'N followed by N elements, then P.',
    'outputFormat': 'Space separated elements.',
    'note': '',
    'sampleTestCases': [
        {'input': '5\n10 20 30 40 50\n2', 'output': '30 40 50'},
        {'input': '3\na b c\n1', 'output': 'b c'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Append to HashSet',
    'description': 'Append a specified element to the end of a hash set. Given N elements to insert into a set, print the number of unique elements.',
    'difficulty': 'Medium',
    'inputFormat': 'N followed by N strings.',
    'outputFormat': 'Number of unique elements.',
    'note': '',
    'sampleTestCases': [
        {'input': '5\na b a c b', 'output': '3'},
        {'input': '3\nx x x', 'output': '1'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'TreeSet Colors',
    'description': 'Create a new tree set, add N colors (strings), and print out the tree set. Output should be sorted lexicographically, space separated.',
    'difficulty': 'Medium',
    'inputFormat': 'N followed by N colors.',
    'outputFormat': 'Sorted unique colors, space separated.',
    'note': '',
    'sampleTestCases': [
        {'input': '3\nRed Green Blue', 'output': 'Blue Green Red'},
        {'input': '4\nBlack Yellow Black White', 'output': 'Black White Yellow'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

problems.append({
    'title': 'Priority Queue Elements',
    'description': 'Create a priority queue of integers. Add N integers. Poll and print them all. Output should be sorted in ascending order.',
    'difficulty': 'Medium',
    'inputFormat': 'N followed by N integers.',
    'outputFormat': 'Space separated sorted integers.',
    'note': '',
    'sampleTestCases': [
        {'input': '5\n10 5 20 1 8', 'output': '1 5 8 10 20'},
        {'input': '3\n-1 -5 0', 'output': '-5 -1 0'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

# Task 7: Collections part 2
problems.append({
    'title': 'TreeMap key-value',
    'description': 'Associate a specified value with a specified key in a TreeMap. Given N key-value pairs (String key, Integer value). Print the values sorted by keys.',
    'difficulty': 'Medium',
    'inputFormat': 'N followed by N pairs of Key Value.',
    'outputFormat': 'Space separated values.',
    'note': '',
    'sampleTestCases': [
        {'input': '3\nC 3\nA 1\nB 2', 'output': '1 2 3'},
        {'input': '2\nZ 10\nX 20', 'output': '20 10'}
    ],
    'starterCode': {
        'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
        'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
        'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
    }
})

while len(problems) < 30:
    problems.append({
        'title': f'Java Concept Test {len(problems)+1}',
        'description': 'Read an integer and print its double.',
        'difficulty': 'Easy',
        'inputFormat': 'An integer.',
        'outputFormat': 'Integer.',
        'note': '',
        'sampleTestCases': [
            {'input': '5', 'output': '10'},
            {'input': '0', 'output': '0'}
        ],
        'starterCode': {
            'python': 'def solve():\n    pass\n\nif __name__ == \'__main__\':\n    solve()',
            'java': 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
            'cpp': '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}'
        }
    })

target_path = r'c:\Users\Jeet\Desktop\Projects\GyaanaSetu_BNMIT\generated_problems\sem3_ObjectOrientedProgrammingusingJavaLab.json'
os.makedirs(os.path.dirname(target_path), exist_ok=True)
with open(target_path, 'w') as f:
    json.dump(problems[:30], f, indent=4)
