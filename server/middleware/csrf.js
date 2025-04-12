export const csrfProtection = (req, res, next) => {  
  // Skip CSRF check for GET/HEAD/OPTIONS requests  
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();  

  const clientToken = req.headers['x-csrf-token'];  
  const serverToken = req.cookies['XSRF-TOKEN'];  

  if (!clientToken || clientToken !== serverToken) {  
    return res.status(403).json({  
      error: 'Invalid CSRF token',  
      code: 'EBADCSRFTOKEN'  
    });  
  }  
  next();  
};