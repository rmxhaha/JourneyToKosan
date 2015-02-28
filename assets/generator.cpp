/*
 * Test Case Generator via tokilib
 * 
 * Problem: XXX
 * Problem author: XXX
 * Generator author: XXX
 */

#include "../generator.h"

#include <iostream>
#include <algorithm>
#define endl '\n'
using namespace std;
int N, A[300100], B[300100];
int N_MAX, A_MAX, B_MAX, A_MIN, B_MIN;

void printSampleCase(int tc)
{
	cout << 8 << endl;
	cout << "1798 1832" << endl;
	cout << "862 700" << endl;
	cout << "1075 1089" << endl;
	cout << "1568 1557" << endl;
	cout << "2575 1984" << endl;
	cout << "1033 950" << endl;
	cout << "1656 1649" << endl;
	cout << "1014 1473" << endl;
}

void printCase()
{
	cout << N << endl;
	for (int i=0;i<N;i++)
		cout << A[i] << " " << B[i] <<endl;
}

void batch0()
{
	beginSampleBatch();

	beginCase();	{ setSubtasks("1, 2");									}	endCase();

	endBatch();
}

void randomArray(int a, int b)
{
	for (int i=a;i<b;i++)
		A[i]=rnd.next(A_MIN,A_MAX),B[i]=rnd.next(B_MIN,B_MAX);	
}

void batch1()
{
	beginBatch();

	N_MAX = 8000;
	setSubtasks("1, 2");

	// Boundary cases
	beginCase();	{ N = 1;		A_MIN = 1;		A_MAX = 1;		B_MIN = 1;		B_MAX = 1;		randomArray(0,N);	}	endCase(); 
	beginCase();	
	{ 
		N = N_MAX;	A_MIN = 1;		A_MAX = 1;		B_MIN = 1;		B_MAX = 1;		randomArray(0,N-1);	
					A_MIN = 1e5;	A_MAX = 1e5;	B_MIN = 1e5;	B_MAX = 1e5;	randomArray(N-1,N);
	} endCase(); 

	// Tricky cases
	beginCase();	{ set_array(A, N, "1, 2, 1, 2"); set_array(B, N, "1, 2, 2, 1");						}	endCase();

	// Uniformly random cases
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e1;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e2;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e3;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e4;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e1;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e2;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e3;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e4;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	
	endBatch();
}

void batch2()
{
	beginBatch();

	N_MAX = 8000;
	setSubtasks("1, 2");

	// Boundary cases
	beginCase();	{ N = 1;		A_MIN = 1;		A_MAX = 1;		B_MIN = 1;		B_MAX = 1;		randomArray(0,N);	}	endCase(); 
	beginCase();	
	{ 
		N = N_MAX;	A_MIN = 1;		A_MAX = 1;		B_MIN = 1;		B_MAX = 1;		randomArray(0,N-1);	
					A_MIN = 1e5;	A_MAX = 1e5;	B_MIN = 1e5;	B_MAX = 1e5;	randomArray(N-1,N);
	} endCase(); 

	// Tricky cases
	beginCase();	{ set_array(A, N, "1, 1, 1000, 1000"); set_array(B, N, "1, 50, 1, 1000");						}	endCase();

	// Uniformly random cases
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e1;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e2;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e3;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e4;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e1;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e2;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e3;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e4;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	
	N_MAX = 3e5;
	setSubtasks("1, 2");

	// Boundary cases
	beginCase();	{ N = 1;		A_MIN = 1;		A_MAX = 1;		B_MIN = 1;		B_MAX = 1;		randomArray(0,N);	}	endCase(); 
	beginCase();	
	{ 
		N = N_MAX;	A_MIN = 1;		A_MAX = 1;		B_MIN = 1;		B_MAX = 1;		randomArray(0,N-1);	
					A_MIN = 1e5;	A_MAX = 1e5;	B_MIN = 1e5;	B_MAX = 1e5;	randomArray(N-1,N);
	} endCase(); 

	// Tricky cases
	beginCase();	{ set_array(A, N, "1, 2, 1, 2"); set_array(B, N, "1, 2, 2, 1");						}	endCase();

	// Uniformly random cases
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e1;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e2;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e3;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e4;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e1;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e2;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e3;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e4;		randomArray(0,N);	}	endCase(); 
	beginCase();	{ N = rnd.next(1,N_MAX);		A_MIN = 1;		A_MAX = 1e5;		B_MIN = 1;		B_MAX = 1e5;		randomArray(0,N);	}	endCase(); 
	
	endBatch();
}

int main(int argc, char* argv[])
{
	beginGenerator(argc, argv);

	setSlug("problem"); 
	setMode("single");
	setSolution("solution");
	setValidator("validator");

	batch0();
	batch1();
	batch2();
	
	endGenerator();
}
