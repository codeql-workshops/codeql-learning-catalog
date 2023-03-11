predicate finishesBefore(string racerOne, string racerTwo) {
    racerOne = "C" and racerTwo = "B"
    or
    racerOne = "D" and racerTwo = "C"
    or
    racerOne = "E" and racerTwo = "A"
    or
    racerOne = "B" and racerTwo = "E"
}

from string racerOne, string racerTwo
where finishesBefore(racerOne, racerTwo)
select racerOne, racerTwo