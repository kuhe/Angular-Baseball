package yak.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

/**
 * 'first', 'second', 'third'
 */
@Target(ElementType.TYPE_USE)
public @interface Runner {}
