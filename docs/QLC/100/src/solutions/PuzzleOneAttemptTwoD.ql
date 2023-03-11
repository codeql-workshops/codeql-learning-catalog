predicate finishesBeforeStep(string racerOne, string racerTwo) {
    racerOne = "C" and racerTwo = "B"
    or
    racerOne = "D" and racerTwo = "C"
    or
    racerOne = "E" and racerTwo = "A"
    or
    racerOne = "B" and racerTwo = "E"
}

from string racerOne, string racerTwo
where
not finishesBeforeStep+(racerOne, racerTwo) and
racerOne = "ABCDE".charAt(_) and
racerTwo = "ABCDE".charAt(_)
select racerOne, racerTwo