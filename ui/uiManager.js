export class UIManager{
 constructor(){this.hint=document.getElementById("hint");}
 loading(){this.hint.innerText="Loading AR...";}
 found(){this.hint.innerText="Hold steady";}
 lost(){this.hint.innerText="Point camera at the frame";}
}