package yak.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Target;

/**
 *
 * Indicate the string as a field occupant identifier: a team.
 * Interchangeably team token, team id, team name, field occupant id.
 *
 */
@Target(ElementType.TYPE_USE)
public @interface TeamToken {}
