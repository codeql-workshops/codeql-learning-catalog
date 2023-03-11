predicate finishesBeforeStep(string racerOne, string racerTwo) {
    racerOne = "C" and racerTwo = "B"
    or
    racerOne = "D" and racerTwo = "C"
    or
    racerOne = "E" and racerTwo = "A"
    or
    racerOne = "B" and racerTwo = "E"
}

predicate firstFinisher(string racer) {
    finishesBeforeStep(racer, _) and
    not exists(string otherRacer | finishesBeforeStep(otherRacer, racer))
}

from string firstFinisher, string other
where finishesBeforeStep+(firstFinisher, other) and firstFinisher(firstFinisher)
select firstFinisher, other