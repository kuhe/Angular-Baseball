package yak.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

/**
 * [0, 0] is catcher POV bottom left corner, and [200, 200] is
 * catcher POV upper right corner.
 *
 * This 200x200 area is not the strike zone, but the pitch zone.
 * The strike zone is a subset of the pitch zone (in the center).
 */
@Target(ElementType.TYPE_USE)
public @interface Coordinate {}
