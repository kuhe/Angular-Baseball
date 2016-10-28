#ifndef ANGULAR_BASEBALL_OPPONENT_H
#define ANGULAR_BASEBALL_OPPONENT_H

#include <TActionController>
#include "applicationhelper.h"


class T_CONTROLLER_EXPORT Opponent : public TActionController
{
Q_OBJECT
public:
Opponent();
Opponent(const Opponent &other);
virtual ~Opponent();

public slots:
void staticInitialize();
void staticRelease();

void index();

protected:
virtual bool preFilter();
};

T_DECLARE_CONTROLLER(Opponent, Opponent)

#endif //ANGULAR_BASEBALL_OPPONENT_H
