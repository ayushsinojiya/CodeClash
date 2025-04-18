// snippets.js

export const LANGUAGE_VERSIONS = {
  c: "10.2.0",       // GCC version from the list
  cpp: "10.2.0",     // GCC version from the list
  python: "3.10.0",  // Python version from the list
};

  
  export const CODE_SNIPPETS = {
    c: `
  #include <stdio.h>
  
  int main() {
      printf("Hello, World!\\n");
      return 0;
  }
  `,
    cpp: `
  #include <iostream>
  
  int main() {
      std::cout << "Hello, World!" << std::endl;
      return 0;
  }
  `,
    python: `
  def greet(name):
      print("Hello, " + name + "!")
  
  greet("Alex")
  `,
  };
  