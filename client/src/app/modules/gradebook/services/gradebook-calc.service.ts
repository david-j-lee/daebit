import { Injectable } from '@angular/core';

import { Class } from 'gradebook/interfaces/class.interface';

@Injectable()
export class GradebookCalcService {
  constructor() {}

  getCompleted(selectedClass: Class): number {
    let value = 0;
    if (selectedClass.items.length > 0) {
      selectedClass.items.forEach(item => {
        if (item.isCompleted) {
          value++;
        }
      });
    }
    return value;
  }

  getRemaining(selectedClass: Class): number {
    let value = 0;
    if (selectedClass.items.length > 0) {
      selectedClass.items.forEach(item => {
        if (!item.isCompleted) {
          value++;
        }
      });
    }
    return value - 1; // subtract one for auto new row
  }

  getCompletedEarned(selectedClass: Class): number {
    let value = 0;
    if (selectedClass.items.length > 0) {
      selectedClass.items.forEach(item => {
        if (item.isCompleted && item.earned) {
          if (selectedClass.isWeighted) {
            value += item.earned / item.possible * item.weight * 100;
          } else {
            value += item.earned;
          }
        }
      });
    }
    return value;
  }

  getCompletedPossible(selectedClass: Class): number {
    let value = 0;
    if (selectedClass.items.length > 0) {
      selectedClass.items.forEach(item => {
        if (item.isCompleted && item.possible) {
          if (selectedClass.isWeighted) {
            value += item.possible * item.weight;
          } else {
            value += item.possible;
          }
        }
      });
    }
    return value;
  }

  getCompletedGrade(selectedClass: Class): number {
    if (selectedClass.completedEarned && selectedClass.completedPossible) {
      return selectedClass.completedEarned / selectedClass.completedPossible;
    } else {
      return 0;
    }
  }

  getTotalEarned(selectedClass: Class): number {
    let value = 0;
    if (selectedClass.items.length > 0) {
      selectedClass.items.forEach(item => {
        if (item.earned) {
          if (selectedClass.isWeighted) {
            // TODO: may need additional error checking
            value += item.possible
              ? item.earned / item.possible * item.weight * 100
              : 0;
          } else {
            value += item.earned;
          }
        }
      });
    }
    return Math.round(value * 10) / 10;
  }

  getTotalPossible(selectedClass: Class): number {
    let value = 0;
    if (selectedClass.isWeighted) {
      // for now weighted classes will always be out of 100,
      // makes grade calculation the same for both types
      value = 100;
    } else {
      if (selectedClass.items.length > 0) {
        selectedClass.items.forEach(item => {
          if (item.possible) {
            value += item.possible;
          }
        });
      }
    }
    return value;
  }

  getTotalGrade(selectedClass: Class): number {
    if (selectedClass.totalEarned && selectedClass.totalPossible) {
      return selectedClass.totalEarned / selectedClass.totalPossible;
    } else {
      return 0;
    }
  }

  getGradeText(grade: number): string {
    let value = '';
    if (grade) {
      if (grade < 0.6) {
        value += 'F';
      } else if (grade < 0.63) {
        value += 'D-';
      } else if (grade < 0.66) {
        value += 'D';
      } else if (grade < 0.7) {
        value += 'D+';
      } else if (grade < 0.73) {
        value += 'C-';
      } else if (grade < 0.76) {
        value += 'C';
      } else if (grade < 0.8) {
        value += 'C+';
      } else if (grade < 0.83) {
        value += 'B-';
      } else if (grade < 0.86) {
        value += 'B';
      } else if (grade < 0.9) {
        value += 'B+';
      } else if (grade < 0.93) {
        value += 'A-';
      } else if (grade < 0.96) {
        value += 'A';
      } else if (grade < 1) {
        value += 'A+';
      } else {
        value += 'A+';
      }
    }
    return value;
  }

  getGradeColor(grade: number): string {
    let value = '';
    if (grade) {
      if (grade < 0.6) {
        value += 'f';
      } else if (grade < 0.63) {
        value += 'd-minus';
      } else if (grade < 0.66) {
        value += 'd';
      } else if (grade < 0.7) {
        value += 'd-plus';
      } else if (grade < 0.73) {
        value += 'c-minus';
      } else if (grade < 0.76) {
        value += 'c';
      } else if (grade < 0.8) {
        value += 'c-plus';
      } else if (grade < 0.83) {
        value += 'b-minus';
      } else if (grade < 0.86) {
        value += 'b';
      } else if (grade < 0.9) {
        value += 'b-plus';
      } else if (grade < 0.93) {
        value += 'a-minus';
      } else if (grade < 0.96) {
        value += 'a';
      } else if (grade < 1) {
        value += 'a-plus';
      } else {
        value += 'a';
      }
    }
    return value;
  }
}
