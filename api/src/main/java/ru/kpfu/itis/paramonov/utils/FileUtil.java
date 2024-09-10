package ru.kpfu.itis.paramonov.utils;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;

public class FileUtil {

    private static final String FILE_PATH_PREFIX = "/tmp";
    private static final int DIRECTORIES_COUNT = 100;

    public static File uploadPartImage(MultipartFile image) throws IOException  {
        String filename = Paths.get(image.getOriginalFilename()).getFileName().toString();

        File file = new File(FILE_PATH_PREFIX + File.separator + filename.hashCode() % DIRECTORIES_COUNT +
                File.separator + filename);

        InputStream content = image.getInputStream();
        file.getParentFile().mkdirs();
        file.createNewFile();

        FileOutputStream out = new FileOutputStream(file);
        byte[] buffer = new byte[content.available()];
        content.read(buffer);
        out.write(buffer);
        out.close();

        return file;
    }
}
