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

from string firstFinisher, string finalOrder
where
    firstFinisher(firstFinisher) and
    finalOrder = concat(string other | finishesBeforeStep*(firstFinisher, other) | other)
select finalOrder