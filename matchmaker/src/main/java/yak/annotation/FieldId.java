package yak.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

/**
 *
 * Indicate a string as a baseball game field identifier.
 *
 */
@Target(ElementType.TYPE_USE)
public @interface FieldId {}
