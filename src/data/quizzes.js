// src/data/quizzes.js  — Master static quiz bank (Grades IV–X)
import { QUIZZES_IV_V }    from './quizzes_grade4_5'
import { QUIZZES_VII_VIII } from './quizzes_grade7_8'
import { QUIZZES_IX_X }    from './quizzes_grade9_10'
import { QUIZZES_VI_EXTRA } from './quizzes_grade6_extra'
import { Q6S2 }  from './quizzes_grade6_sci2'
import { Q6S3 }  from './quizzes_grade6_sci3'
import { Q6S4 }  from './quizzes_grade6_sci4'
import { Q7S2 }  from './quizzes_grade7_sci2'
import { Q7S3 }  from './quizzes_grade7_sci3'
import { Q8S2 }  from './quizzes_grade8_sci2'
import { Q8S3 }  from './quizzes_grade8_sci3'
import { Q8S4 }  from './quizzes_grade8_sci4'
import { Q9S2 }  from './quizzes_grade9_sci2'
import { Q9S3 }  from './quizzes_grade9_sci3'
import { Q9S4 }  from './quizzes_grade9_sci4'
import { Q9S5 }  from './quizzes_grade9_sci5'
import { Q10S2 } from './quizzes_grade10_sci2'
import { Q10S3 } from './quizzes_grade10_sci3'
import { Q10S4 } from './quizzes_grade10_sci4'

function mergeDeep(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = target[key] || {}
      mergeDeep(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  }
  return target
}

function addChapters(base, grade, subject, chapObj) {
  base[grade] = base[grade] || {}
  base[grade][subject] = base[grade][subject] || {}
  Object.assign(base[grade][subject], chapObj)
}

const base = {}

// IV & V
mergeDeep(base, QUIZZES_IV_V)

// VI Science
addChapters(base, 'VI', 'Science', {
  "Food: Where Does It Come From?": QUIZZES_VI_EXTRA["VI"]?.["Science"]?.["Food: Where Does It Come From?"] ?? [],
  "Nutrition in Plants": QUIZZES_VI_EXTRA["VI"]?.["Science"]?.["Nutrition in Plants"] ?? [],
  ...QUIZZES_VI_EXTRA["VI"]["Science"],
  ...Q6S2,
  ...Q6S3,
  ...Q6S4,
})
// VI Math
addChapters(base, 'VI', 'Mathematics', QUIZZES_VI_EXTRA["VI"]["Mathematics"])

// VII Science
addChapters(base, 'VII', 'Science', {
  ...QUIZZES_VII_VIII["VII"]["Science"],
  ...Q7S2,
  ...Q7S3,
})

// VIII Science
addChapters(base, 'VIII', 'Science', {
  ...QUIZZES_VII_VIII["VIII"]["Science"],
  ...Q8S2,
  ...Q8S3,
  ...Q8S4,
})

// IX Science
addChapters(base, 'IX', 'Science', {
  ...QUIZZES_IX_X["IX"]["Science"],
  ...Q9S2,
  ...Q9S3,
  ...Q9S4,
  ...Q9S5,
})

// X Science
addChapters(base, 'X', 'Science', {
  ...QUIZZES_IX_X["X"]["Science"],
  ...Q10S2,
  ...Q10S3,
  ...Q10S4,
})

export const STATIC_QUIZZES = base
