class BaseError extends Error {
  public description;

  constructor(message: string, description?: string) {
    super(message);
    this.name = `BaseError`;
    this.description = description;
  }

  static handleError = (error: any) => {
    const responseData = error?.response?.data;
    const isHttpError = Boolean(responseData?.error);
    if (isHttpError) {
      return new BaseError(responseData.error, responseData.description);
    }
    return new BaseError(error.message);
  };
}

export default BaseError;
