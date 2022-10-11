export default function set(name, value) {
  console.log("setting", this, name, value);
  this[name] = value;
  loop_1: for (let i = 0; i < this.updaters.length; i++) {
    loop_2: for (let j = 0; j < this.updaters[i][0].length; j++) {
      if (this.updaters[i][0][j] === name) {
        this.updaters[i][1].call(this, null);
        continue loop_2;
      }
    }
  }
}
