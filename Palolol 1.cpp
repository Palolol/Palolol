#include <iostream> 
using namespace std;
int main (){
    int age; 
    cout <<"Enter age: ";
    cin >>age;
    if(age>=2&&age<=5){
        cout<<"Go to KinderGarten";
    }else if(age<=6&&age<=12){
        cout<<"Go to Primary";
    }else if(age>=13&&age<=15){
        cout<<"Go to Secondary";
    }else if(age>=16&&age<=18){
        cout<<"Go to High School";
    }else if(age>=19&&age<=23){
        cout<<"Go to University";
    }else if(age>=24&&age<=60){
        cout<<"Go to Work";
    }else if(age>=61&&age<=100){
        cout<<"Retire";
    }
    return 0;
}