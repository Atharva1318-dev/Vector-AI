const { useState } = require("react")
import { toast } from "sonner";

const useFetch = (callback) => {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    // the actual api calling function will be returned by this function, useFetch on itself wont call the api, it will return a function that calls the API
    const fn = async (...args) => {
        setLoading(true);
        setError(null);

        try {
            const response = await callback(...args);
            setData(response);
            setError(null);
        } catch (error) {
            setError(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return { data, loading, error, fn, setData };
}

export default useFetch;