package ru.kpfu.itis.paramonov.repository.impl;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;
import ru.kpfu.itis.paramonov.model.Ban;
import ru.kpfu.itis.paramonov.model.User;
import ru.kpfu.itis.paramonov.repository.BanRepository;

import javax.persistence.EntityManager;
import javax.persistence.criteria.*;
import java.util.List;

@Repository
@AllArgsConstructor
public class BanRepositoryImpl implements BanRepository {

    private EntityManager entityManager;

    @Override
    public Ban getLatestBan(Long userId) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Ban> cq = cb.createQuery(Ban.class);
        Root<Ban> root = cq.from(Ban.class);

        Subquery<Long> sub = cq.subquery(Long.class);

        Root<Ban> subRoot = sub.from(Ban.class);
        Join<Ban, User> userJoin = subRoot.join("bannedUser");
        sub.select(cb.max(subRoot.get("givenAt")))
                .where(cb.equal(userJoin.get("id"), userId));

        Join<Ban, User> mainUserJoin = root.join("bannedUser");
        cq.select(root)
                .where(cb.equal(root.get("givenAt"), sub),
                        cb.equal(mainUserJoin.get("id"), userId));
        List<Ban> result = entityManager.createQuery(cq).getResultList();
        return result.get(0);
    }
}
