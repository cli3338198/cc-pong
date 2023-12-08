describe("Pong Table", () => {
  let target;

  beforeEach(() => {
    // Set up a clean environment before each test
    // document.body.innerHTML = '<div id="target"></div>';
    target = document.getElementById("target");
    // createPongTable();
  });

  it("should create a pong table with a center line", () => {
    // Expect the pong table to be present
    expect(target.querySelector(".pong-table")).toBeTruthy();

    // Expect the center line to be present
    expect(target.querySelector(".center-line")).toBeTruthy();
  });

  it("should create left and right paddles", () => {
    // Expect the left paddle to be present
    expect(target.querySelector(".left-paddle")).toBeTruthy();

    // Expect the right paddle to be present
    expect(target.querySelector(".right-paddle")).toBeTruthy();
  });
});
