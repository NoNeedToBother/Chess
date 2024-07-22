package ru.kpfu.itis.paramonov.utils;

public class ExceptionMessages {

    public final static String POST_EXISTS_ERROR = "Post with this title already exists";

    public static final String NO_POST_FOUND_ERROR = "No post was found";

    public static final String NO_USER_FOUND_ERROR = "No user was found";

    public static final String NO_COMMENT_FOUND_ERROR = "No comment was found";

    public static final String NO_SUFFICIENT_AUTHORITY_ERROR = "No sufficient authority to perform this action";

    public final static String UPLOAD_ERROR = "Failed to upload";

    public final static String DELETE_ERROR = "Failed to delete";

    public final static String GET_ERROR = "Failed to get";

    public final static String UPDATE_ERROR = "Failed to update";

    public final static String INCORRECT_ROLE_ERROR = "Incorrect role";

    public final static String UPDATE_OWN_POST_DENIED_ERROR = "Cannot perform for your own post";

    public final static String EMPTY_CREDENTIALS_ERROR = "Credentials must be not empty";

    public final static String NON_UNIQUE_USERNAME_ERROR = "This username already belongs to other user";

    public final static String SHORT_USERNAME_ERROR = "Username length should be at least 6 characters";

    public final static String SHORT_PASSWORD_ERROR = "Password length should be at least 8 characters";

    public final static String INVALID_PASSWORD_ERROR = "Password should have at least one of each:" +
            " uppercase, lowercase and digit character";

    public final static String INCORRECT_CREDENTIALS_ERROR = "Incorrect credentials";

    public final static String INVALID_REFRESH_TOKEN_ERROR = "Invalid refresh token";

    public final static String INTERNAL_SERVER_ERROR = "Something went wrong, try again later";

    public final static String INVALID_PARAMETER_SIZE = "Invalid parameter of size";

    public final static String USER_BANNED_ERROR = "Account is banned";

}
