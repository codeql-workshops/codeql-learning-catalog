string finishesBeforeStep(string racer) {
  racer = "C" and result = "B"
  or
  racer = "D" and result = "C"
  or
  racer = "E" and result = "A"
  or
  racer = "B" and result = "E"
}

predicate firstFinisher(string racer) {
  exists(finishesBeforeStep(racer)) and
  not racer = finishesBeforeStep(_)
}

predicate lastFinisher(string racer) {
  not exists(finishesBeforeStep(racer)) and racer = finishesBeforeStep(_)
}

string finishOrderFor(string racer) {
  lastFinisher(racer) and result = racer
  or
  result = racer + finishOrderFor(finishesBeforeStep(racer))
}

from string firstFinisher, string finalOrder
where
  firstFinisher(firstFinisher) and
  finalOrder = finishOrderFor(firstFinisher)
select finalOrder
