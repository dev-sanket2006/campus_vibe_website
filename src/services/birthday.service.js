import prisma from "../config/db.js";

// ✅ Today's birthdays
export async function getTodayBirthdays() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  return await prisma.user.findMany({
    where: { dob: { not: null } },
    select: { id: true, name: true, dob: true },
  }).then(users =>
    users.filter(user => {
      const dob = new Date(user.dob);
      return dob.getDate() === day && dob.getMonth() + 1 === month;
    })
  );
}

// ✅ Upcoming birthdays (next N days)
export async function getUpcomingBirthdays(daysAhead = 7) {
  const today = new Date();
  const upcoming = new Date();
  upcoming.setDate(today.getDate() + daysAhead);

  return await prisma.user.findMany({
    where: { dob: { not: null } },
    select: { id: true, name: true, dob: true },
  }).then(users =>
    users.filter(user => {
      const dob = new Date(user.dob);
      // Normalize year to current year for comparison
      const birthdayThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
      return birthdayThisYear >= today && birthdayThisYear <= upcoming;
    })
  );
}
