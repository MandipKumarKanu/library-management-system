useEffect(() => {
    const fetchPendingApprovals = async () => {
      const pendingApproveCollection = collection(db, "pending_approve_return");

      const userBookCollection = collection(db, "myBook");
      const userBookDoc = doc(userBookCollection, userId);
      try {
        const userBookData = await getDoc(userBookDoc);
        setUserD(userBookData.data());
        const querySnapshot = await getDocs(pendingApproveCollection);

        const approvals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(approvals);

        const idExists = approvals.some((entry) => setuserDId(entry.id));
        console.log(userDId, "idexits")
        // if (idExists) {
          const targetObject = approvals.find((entry) => entry.id );
          console.log(targetObject)
          setPendingApprovals([targetObject])
          // setIssuedBooks([targetObject]);
        // }

        // setPendingApprovals(approvals);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pending approvals:", error);
        setLoading(false);
      }
    };

    fetchPendingApprovals();
  }, [setUserD]);
  console.log(userD);

  async function userd(returnId) {
    setUserD((prevUserD) => {
      const { [returnId]: _, ...updatedUserD } = prevUserD;

      const userBookCollection = collection(db, "myBook");
      const userBookDoc = doc(userBookCollection, userId);
      const useCollection = collection(db, "pending_approve_return");
      const pendingApproveRef = doc(useCollection, userId);

      handleApprove(
        userBookDoc,
        useCollection,
        pendingApproveRef,
        updatedUserD
      );

      return updatedUserD;
    });
  }

  async function handleApprove(userBookDoc, useCollection, pendingApproveRef) {
    console.log("Handling approval");

    await setDoc(userBookDoc, userD);
    await setDoc(pendingApproveRef, userD);

    console.log(
      "Book removed from myBook and pending_approve collections.",
      userD
    );
  }