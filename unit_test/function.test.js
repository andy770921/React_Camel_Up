import ThreeScene from "../src/three_scene";

test('test judgeCamelRanking function', () => {
    let a = new ThreeScene;
    a.state.camels[0] = {level: 1, boxNum: 5, color: 'orange'};
    a.state.camels[1] = {level: 1, boxNum: 6, color: 'blue'};
    a.state.camels[2] = {level: 2, boxNum: 6, color: 'green'};
    a.state.camels[3] = {level: 1, boxNum: 8, color: 'red'};
    let ans = ["red", "green", "blue", "orange"];
    expect(a.judgeCamelRanking()).toEqual(ans);
  });
test('test BoxNum adding function', () => {
    let b = new ThreeScene;
    b.state.camels[0] = {id: 10, boxNum: 5};
    b.state.camels[1] = {id: 20, boxNum: 6};
    b.state.camels[2] = {id: 30, boxNum: 7};
    b.state.camels[3] = {id: 40, boxNum: 8};
    expect(b.setNextBox(20,3)).toBe(9);
  });
