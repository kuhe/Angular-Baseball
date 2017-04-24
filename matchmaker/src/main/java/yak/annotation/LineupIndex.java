package yak.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

/**
 * A lineup position index (0-8);
 */
@Target(ElementType.TYPE_USE)
public @interface LineupIndex {}
