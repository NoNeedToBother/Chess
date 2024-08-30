plugins {
    id("java")
    id("application")
    id("org.springframework.boot") version "2.7.17"
    kotlin("jvm")
}

apply(plugin = "io.spring.dependency-management")

group = "ru.kpfu.itis.paramonov"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    annotationProcessor("org.hibernate:hibernate-jpamodelgen:${properties["hibernateVersion"]}")
    implementation("org.postgresql:postgresql:42.7.2")

    compileOnly("org.projectlombok:lombok:${properties["lombokVersion"]}")
    annotationProcessor("org.projectlombok:lombok:${properties["lombokVersion"]}")
    implementation("org.slf4j:slf4j-api:${properties["slf4jVersion"]}")
    implementation("org.slf4j:slf4j-simple:${properties["slf4jVersion"]}")

    implementation("io.jsonwebtoken:jjwt-api:${properties["jwtVersion"]}")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:${properties["jwtVersion"]}")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:${properties["jwtVersion"]}")
    runtimeOnly("org.bouncycastle:bcprov-jdk18on:1.76")
    implementation("com.cloudinary:cloudinary-core:${properties["cloudinaryVersion"]}")
    implementation("com.cloudinary:cloudinary-http44:${properties["cloudinaryVersion"]}")
    implementation("commons-fileupload:commons-fileupload:1.5")

    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    implementation(kotlin("stdlib-jdk8"))
}

tasks.test {
    useJUnitPlatform()
}
kotlin {
    jvmToolchain(8)
}