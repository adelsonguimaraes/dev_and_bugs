var _a;
class Critical {
}
_a = Critical;
Critical.probability = 1;
Critical.multiplier = 3;
Critical.tryCritical = (extra_damage) => {
    const rand = Math.floor(Math.random() * 100);
    const probablity = (_a.probability + extra_damage);
    if (rand <= probablity) {
        return _a.multiplier;
    }
    return 0;
};
export { Critical };
