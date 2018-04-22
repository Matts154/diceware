require("../app/toTitleCase.util");

function compare(input, output) {
    expect(input.toTitleCase()).toBe(output);
}

test("UPPERCASE -> Title Case", compare("TEST", "Test"));
test("lowercase -> Title Case", compare("test", "Test"));
test(
    "Excluded word at the beginning",
    compare("the quick brown fox", "The Quick Brown Fox")
);
test("Excluded word in the middle", compare("foo of bar", "Foo of Bar"));
test("Capitalizing USA", compare("usa", "USA"));
test("Capitalizing 3D", compare("3d", "3D"));
test("Capitalizing EFF", compare("eff", "EFF"));
