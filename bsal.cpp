#include <iostream>
#include <vector>

void insertionSort(std::vector<int>& vec) {
    int n = vec.size();
    for (int i = 1; i < n; i++) {
        int key = vec.at(i);
        int j = i - 1;
        while (j >= 0 && vec.at(j) > key) {
            vec.at(j + 1) = vec.at(j);
            j = j - 1;
        }
        vec.at(j + 1) = key;
    }
}

std::vector<int> F1(std::vector<int> vector) {
    int max = vector.at(0);
    for (int i = 1; i < vector.size(); i++) {
        if (vector.at(i) > max) {
            max = vector.at(i);
        }
    }

    std::vector<std::vector<int>> vectorOfVectors(max + 1);

    for (int i = 0; i < vector.size(); i++) {
        int index = (vector.size() * vector.at(i)) / (max + 1);
        vectorOfVectors.at(index).push_back(vector.at(i));
    }

    for (int i = 0; i <= max; i++) {
        insertionSort(vectorOfVectors.at(i));
    }

    std::vector<int> sortedVector;
    for (int i = 0; i <= max; i++) {
        sortedVector.insert(sortedVector.end(), vectorOfVectors.at(i).begin(), vectorOfVectors.at(i).end());
    }

    return sortedVector;
}

int main() {
    std::vector<int> vector = {9, 4, 6, 3, 2};
    std::vector<int> sortedVector = F1(vector);

    for (int num : sortedVector) {
        std::cout << num << " ";
    }

    return 0;
}
