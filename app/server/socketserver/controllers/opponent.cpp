#include "opponent.h"


Opponent::Opponent()
        : TActionController()
{ }

Opponent::Opponent(const Opponent &)
        : TActionController()
{ }

Opponent::~Opponent()
{ }

void Opponent::staticInitialize()
{ }

void Opponent::staticRelease()
{ }

void Opponent::index() {
    renderText("hello, world");
}

bool Opponent::preFilter()
{
    return true;
}


// Don't remove below this line
T_REGISTER_CONTROLLER(Opponent)
