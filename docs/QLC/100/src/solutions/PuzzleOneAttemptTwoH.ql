predicate finishesBeforeStep(string racerOne, string racerTwo) {
    racerOne = "C" and racerTwo = "B"
    or
    racerOne = "D" and racerTwo = "C"
    or
    racerOne = "E" and racerTwo = "A"
    or
    racerOne = "B" and racerTwo = "E"
}

predicate lastFinisher(string racer) {
    not finishesBeforeStep(racer, _) and finishesBeforeStep(_, racer)
}

from string lastFinisher
where lastFinisher(lastFinisher)
select lastFinisher