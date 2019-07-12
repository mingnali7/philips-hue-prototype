$(document).ready(() => {
  console.log("jquery loaded")
  $('#redBlue').click(() => {
    console.log("clicked")
    $.ajax({
      url: "/activate",
      type: "POST",
      dtaType: "json",
      data: { id: "bdhXHy4I1pQBCvY" }
    }, function () {
      console.log("redBlue triggered")
    })
  })

  $('#redGreen').click(() => {
    console.log("clicked")
    $.ajax({
      url: "/activate",
      type: "POST",
      dtaType: "json",
      data: { id: "LDTXTZVIQXr8gQi" }
    }, function () {
      console.log("red+green triggered")
    })
  })

  $('#greenBlue').click(() => {
    console.log("clicked")
    $.ajax({
      url: "/activate",
      type: "POST",
      dtaType: "json",
      data: { id: "i7todiRCzG7KmON" }
    }, function () {
      console.log("red+green triggered")
    })
  })

  $('#redGreenBlue').click(() => {
    console.log("clicked")
    $.ajax({
      url: "/activate",
      type: "POST",
      dtaType: "json",
      data: { id: "gfepusOd3Aev9Bz" }
    }, function () {
      console.log("red+green triggered")
    })
  })
})