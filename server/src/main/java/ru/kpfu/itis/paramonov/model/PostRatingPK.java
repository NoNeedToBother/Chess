package ru.kpfu.itis.paramonov.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@EqualsAndHashCode
public class PostRatingPK implements Serializable {

    private Long post;

    private Long user;
}
