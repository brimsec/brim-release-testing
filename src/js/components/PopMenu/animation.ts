export function animatePopMenu(menu: any, position: string) {
  if (position.includes("top")) {
    menu.animate(popDown, settings)
  } else {
    menu.animate(popUp, settings)
  }
}

const settings = {
  duration: 100,
  easing: "cubic-bezier(0,0,1,1)"
}

const popUp = [
  {transform: "scale(1) translateY(-18px)", opacity: 0.25},
  {transform: "scale(1) translateY(2px)", opacity: 0.5, offset: 0.25},
  {opacity: 1},
  {transform: "scale(1) translateY(0px)"}
]

const popDown = [
  {transform: "scale(1) translateY(18px)", opacity: 0.25},
  {transform: "scale(1) translateY(-2px)", opacity: 0.5, offset: 0.25},
  {opacity: 1},
  {transform: "scale(1) translateY(0px)"}
]
