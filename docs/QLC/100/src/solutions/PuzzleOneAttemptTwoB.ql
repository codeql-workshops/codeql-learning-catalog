predicate finishesBeforeStep(string racerOne, string racerTwo) {
    racerOne = "C" and racerTwo = "B"
    or
    racerOne = "D" and racerTwo = "C"
    or
    racerOne = "E" and racerTwo = "A"
    or
    racerOne = "B" and racerTwo = "E"
}

predicate finishesBefore(string racerOne, string racerTwo) {
    finishesBeforeStep(racerOne, racerTwo)
    or
    exists(string otherRacer | finishesBeforeStep(racerOne, otherRacer) |
    finishesBefore(otherRacer, racerTwo)
    )
}

from string racerOne, string racerTwo
where
  finishesBefore(racerOne, racerTwo)
select racerOne, racerTwo