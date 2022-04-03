class RandomClass {
    nextInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

export var Random = new RandomClass();
