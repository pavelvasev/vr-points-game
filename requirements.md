# Basic requirements

A software should render points cloud in 3D space. Cloud source should be configurable, e.g. from some external source, or static 3D models, or from algorithm.

A software should implement process of changing state of points described in experiment idea. E.g. it should time to time start marking some points as red ones, and after some period nearby points should start same recursive process unless the point is "cured" by a user.

An interaction with user should be provided in some way, for example by clicking with mouse or by VR controllers.

During experiment, a software should perform counting of cured points, non-cured points, non-cured points infected by other points.

A coloring algorithm should be configurable / changeable.

A software should track user name, experiment configuration and date, and it's results including counters specified above and time consumed.


# Multi-Coloring

Yellow. Green. Blue. Orange. Violet. In an equal ratio in a completely random order. The same level of brightness and saturation.
Active: ping, then red, then dark-purple. Purple points activate nearest points.
Finished: black.
Cured: white.

(Про цвета.
Жёлтый. Зелёный. Синий. Оранжевый. Фиолетовый. В равном соотношении в абсолютно случайном порядке. Один и тот же уровень светлоты и насыщенности.
Больные точки.
Начинают с бледно-розового, потом алеют, потом бордовые. Бордовые заражают. потом чёрные (смерть).
Леченные — белые.)
